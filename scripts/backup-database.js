const fs = require('fs');
const path = require('path');

async function backup() {
  const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
  const envContent = fs.readFileSync(envPath, 'utf8');
  const url = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
  const key = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim();

  if (!url || !key) {
    console.error('Supabase URL or Service Role Key missing in env file');
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(process.cwd(), `database_backup_${timestamp}`);
  fs.mkdirSync(backupDir, { recursive: true });
  fs.mkdirSync(path.join(backupDir, 'tables'), { recursive: true });
  fs.mkdirSync(path.join(backupDir, 'storage'), { recursive: true });

  // 1. Backup env files
  if (fs.existsSync('.env')) {
    fs.copyFileSync('.env', path.join(backupDir, 'env.backup'));
  }
  if (fs.existsSync('.env.local')) {
    fs.copyFileSync('.env.local', path.join(backupDir, 'env.local.backup'));
  }

  console.log(`Starting backup to ${backupDir}...`);

  const tables = [
    'registrations',
    'registration_status_history',
    'registration_packages',
    'committees',
    'admin_profiles',
    'platform_settings',
    'payments',
    'registration_notes'
  ];

  const fullData = {};

  for (const table of tables) {
    try {
      let allRows = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const offset = page * pageSize;
        const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Range': `${offset}-${offset + pageSize - 1}`,
            'Prefer': 'count=exact'
          }
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`Error fetching table ${table}: ${res.status} ${errText}`);
          break;
        }

        const rows = await res.json();
        if (Array.isArray(rows)) {
          allRows = allRows.concat(rows);
          if (rows.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }

      fullData[table] = allRows;
      fs.writeFileSync(
        path.join(backupDir, 'tables', `${table}.json`),
        JSON.stringify(allRows, null, 2),
        'utf8'
      );
      console.log(`✓ Table '${table}': ${allRows.length} rows saved.`);
    } catch (e) {
      console.error(`Failed to backup table ${table}:`, e);
    }
  }

  fs.writeFileSync(
    path.join(backupDir, 'all_database_data.json'),
    JSON.stringify(fullData, null, 2),
    'utf8'
  );

  // Generate basic SQL inserts
  let sqlContent = `-- Database Backup taken at ${new Date().toISOString()}\n\n`;
  for (const [table, rows] of Object.entries(fullData)) {
    if (rows.length === 0) continue;
    sqlContent += `-- Table: ${table} (${rows.length} rows)\n`;
    for (const row of rows) {
      const cols = Object.keys(row);
      const vals = cols.map(c => {
        const val = row[c];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number' || typeof val === 'boolean') return String(val);
        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
        return `'${String(val).replace(/'/g, "''")}'`;
      });
      sqlContent += `INSERT INTO "${table}" (${cols.map(c => `"${c}"`).join(', ')}) VALUES (${vals.join(', ')}) ON CONFLICT DO NOTHING;\n`;
    }
    sqlContent += '\n';
  }
  fs.writeFileSync(path.join(backupDir, 'backup.sql'), sqlContent, 'utf8');
  console.log(`✓ Generated SQL backup at ${path.join(backupDir, 'backup.sql')}`);

  // Backup storage files
  const buckets = ['profile-photos', 'payment-proofs'];
  for (const bucket of buckets) {
    try {
      const bucketDir = path.join(backupDir, 'storage', bucket);
      fs.mkdirSync(bucketDir, { recursive: true });

      const listRes = await fetch(`${url}/storage/v1/object/list/${bucket}`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prefix: '', limit: 1000 })
      });

      if (listRes.ok) {
        const files = await listRes.json();
        if (Array.isArray(files)) {
          console.log(`Found ${files.length} objects in storage bucket '${bucket}'`);
          for (const file of files) {
            if (!file.name) continue;
            const fileRes = await fetch(`${url}/storage/v1/object/authenticated/${bucket}/${file.name}`, {
              headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
              }
            });
            if (fileRes.ok) {
              const buf = Buffer.from(await fileRes.arrayBuffer());
              fs.writeFileSync(path.join(bucketDir, file.name), buf);
              console.log(`  ✓ Saved file ${bucket}/${file.name}`);
            }
          }
        }
      }
    } catch (e) {
      console.error(`Failed to backup bucket ${bucket}:`, e);
    }
  }

  // Also create a stable named copy 'database_backup_latest'
  const latestDir = path.resolve(process.cwd(), 'database_backup_latest');
  fs.cpSync(backupDir, latestDir, { recursive: true });

  console.log(`\n🎉 Backup successfully completed!`);
  console.log(`Backup location: ${backupDir}`);
  console.log(`Latest backup location: ${latestDir}`);
}

backup().catch(console.error);
