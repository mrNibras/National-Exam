const ethiopianRegions = [
  {
    id: 'aa',
    name: 'Addis Ababa',
    zones: []
  },
  {
    id: 'af',
    name: 'Afar',
    zones: [
      { id: 'af_zone_1', name: 'Administrative Zone 1', woredas: ['Awash', 'Korem', 'Asaita'] },
      { id: 'af_zone_2', name: 'Administrative Zone 2', woredas: ['Dupti', 'Jewaha', 'Elidar'] },
      { id: 'af_zone_3', name: 'Administrative Zone 3', woredas: ['Chifra', 'Dubti', 'Mille'] }
    ]
  },
  {
    id: 'am',
    name: 'Amhara',
    zones: [
      { id: 'am_south', name: 'South Gondar Zone', woredas: ['Gondar', 'Bahir Dar', 'Metema'] },
      { id: 'am_north', name: 'North Gondar Zone', woredas: ['Humera', 'Shire', 'Rama'] },
      { id: 'am_east', name: 'East Gojjam Zone', woredas: ['Debre Markos', 'Mota', 'Bichena'] },
      { id: 'am_west', name: 'West Gojjam Zone', woredas: ['Finote Selam', 'Dangila', 'Tilili'] },
      { id: 'am_south_wollo', name: 'South Wollo Zone', woredas: ['Desie', 'Kobo', 'Senbete'] },
      { id: 'am_north_wollo', name: 'North Wollo Zone', woredas: ['Weldiya', 'Lalibela', 'Hagere Hiywet'] },
      { id: 'am_agew', name: 'Agewnom Special Zone', woredas: ['Metekel', 'Kibet', 'Chilga'] }
    ]
  },
  {
    id: 'bn',
    name: 'Benishangul-Gumuz',
    zones: [
      { id: 'bn_metz', name: 'Metekel Zone', woredas: ['Bakelo', 'Urji', 'Kurmuk'] },
      { id: 'bn_kamashi', name: 'Kamashi Zone', woredas: ['Bure', 'Komek', 'Gimji'] },
      { id: 'bn_anegaso', name: 'Anegaso-Sheka Zone', woredas: ['Jiren', 'Sheka', 'Chagni'] }
    ]
  },
  {
    id: 'dt',
    name: 'Dire Dawa',
    zones: []
  },
  {
    id: 'gr',
    name: 'Gambela',
    zones: [
      { id: 'gr_nuer', name: 'Nuer Zone', woredas: ['Gambela', 'Itang', 'Jikaw'] },
      { id: 'gr_anyuak', name: 'Anyuak Zone', woredas: ['Jikaw', 'Godere', 'Kurmuk'] }
    ]
  },
  {
    id: 'hr',
    name: 'Harari',
    zones: []
  },
  {
    id: 'or',
    name: 'Oromia',
    zones: [
      { id: 'or_east', name: 'East Shewa Zone', woredas: ['Adama', 'Meki', 'Sendafa'] },
      { id: 'or_west', name: 'West Shewa Zone', woredas: ['Ambo', 'Nekemte', 'Sire'] },
      { id: 'or_south', name: 'South Shewa Zone', woredas: ['Butajira', 'Arsi Negele', 'Dodola'] },
      { id: 'or_hararge', name: 'Hararge Zone', woredas: ['Harar', 'Chiro', 'Gursum'] },
      { id: 'or_bale', name: 'Bale Zone', woredas: ['Robe', 'Goba', 'Sof Oumer'] },
      { id: 'or_borena', name: 'Borena Zone', woredas: ['Yabello', 'Arero', 'Moyale'] }
    ]
  },
  {
    id: 'sm',
    name: 'Somali',
    zones: [
      { id: 'sm_fafan', name: 'Fafan Zone', woredas: ['Jijiga', 'Kebri Dehar', 'Dega Habur'] },
      { id: 'sm_ghimbi', name: 'Ghimbi Zone', woredas: ['Shinile', 'Awbare', 'Kelafo'] }
    ]
  },
  {
    id: 'sn',
    name: 'Southern Nations, Nationalities, and Peoples\' Region (SNNPR)',
    zones: [
      { id: 'sn_gamo', name: 'Gamo Zone', woredas: ['Arba Minch', 'Basketo', 'Bonay'] },
      { id: 'sn_derashe', name: 'Derashe Zone', woredas: ['Arba Minch', 'Kibet', 'Chano'] },
      { id: 'sn_hadiya', name: 'Hadiya Zone', woredas: ['Hosaena', 'Asasa', 'Singe'] },
      { id: 'sn_kambata', name: 'Kambata Zone', woredas: ['Bench Maji', 'Konso', 'Burji'] }
    ]
  },
  {
    id: 'tg',
    name: 'Tigray',
    zones: [
      { id: 'tg_central', name: 'Central Zone', woredas: ['Mekelle', 'Adigrat', 'Wukro'] },
      { id: 'tg_eastern', name: 'Eastern Zone', woredas: ['Abi Adi', 'Saesi Tsaga', 'Waja'] },
      { id: 'tg_western', name: 'Western Zone', woredas: ['Shire', 'Humera', 'Kolito'] },
      { id: 'tg_southern', name: 'Southern Zone', woredas: ['Axum', 'Adwa', 'Qohaito'] },
      { id: 'tg_northern', name: 'Northern Zone', woredas: ['Abdura', 'Elabered', 'Erob'] }
    ]
  }
];

export default ethiopianRegions;