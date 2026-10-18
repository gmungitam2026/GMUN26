-- GMUN 5.0: Update MCU committee name and agenda with the official agenda
update committees
set name = 'Marvel Cinematic Universe',
    agenda = 'The Morality of Power: Reassessing Heroism, Villainy, and the Justification of Sacrifice in the Marvel Cinematic Universe'
where id = 'mcu';
