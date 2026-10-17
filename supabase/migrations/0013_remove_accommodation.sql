-- GMUN 5.0: Deactivate accommodation package as accommodation is no longer offered.
update registration_packages
set active = false,
    updated_at = now()
where id = 'gmun-lunch-accommodation';
