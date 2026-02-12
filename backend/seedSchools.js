require('dotenv').config();
const connectDB = require('./db');
const School = require('./School');

// General schools to seed with enhanced structure
const schools = [
  // Addis Ababa schools
  { schoolCode: 'AA-SEC-01452', name: 'Addis Ababa Secondary School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-01234', name: 'Black Lion School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-01567', name: 'Meskel School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-01789', name: 'Tikur Anbessa School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-PRIM-02345', name: 'Sengater School', level: 'Primary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-PREP-03456', name: 'Lebu School', level: 'Preparatory', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-04567', name: 'Hawassa Model School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-05678', name: 'GGMC School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-PRIM-06789', name: 'Sanyit School', level: 'Primary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-07890', name: 'Yeka School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-08901', name: 'Kolfe School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-09012', name: 'Bole School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-PRIM-10123', name: 'Piassa School', level: 'Primary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-11234', name: 'Megenagna School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-12345', name: 'Kality School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-PREP-13456', name: 'Arada School', level: 'Preparatory', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-14567', name: 'Gerji School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-15678', name: 'Mexico School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-PRIM-16789', name: 'Lamberet School', level: 'Primary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-17890', name: 'Tirunesh Beijing School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },

  // Amhara Region Schools
  { schoolCode: 'AM-PREP-01234', name: 'Bahir Dar Preparatory School', level: 'Preparatory', ownership: 'Public', city: 'Bahirdar' },
  { schoolCode: 'AM-SEC-02345', name: 'Gondar Comprehensive High School', level: 'Secondary', ownership: 'Public', city: 'Gondar' },
  { schoolCode: 'AM-SEC-03456', name: 'Dessie Comprehensive School', level: 'Secondary', ownership: 'Public', city: 'Dessie' },
  { schoolCode: 'AM-SEC-04567', name: 'Debre Berhan School', level: 'Secondary', ownership: 'Public', city: 'Debre Berhan' },
  { schoolCode: 'AM-SEC-05678', name: 'Debre Markos Model School', level: 'Secondary', ownership: 'Public', city: 'Debre Markos' },
  { schoolCode: 'AM-SEC-06789', name: 'Kombolcha Secondary School', level: 'Secondary', ownership: 'Public', city: 'Kombolcha' },
  { schoolCode: 'AM-SEC-07890', name: 'Debre Tabor School', level: 'Secondary', ownership: 'Public', city: 'Debre Tabor' },
  { schoolCode: 'AM-SEC-08901', name: 'Weldiya Secondary School', level: 'Secondary', ownership: 'Public', city: 'Weldiya' },
  { schoolCode: 'AM-SEC-09012', name: 'Sekota Secondary School', level: 'Secondary', ownership: 'Public', city: 'Sekota' },
  { schoolCode: 'AM-SEC-10123', name: 'Alamata School', level: 'Secondary', ownership: 'Public', city: 'Alamata' },
  { schoolCode: 'AM-SEC-11234', name: 'Finote Selam Secondary School', level: 'Secondary', ownership: 'Public', city: 'Finote Selam' },
  { schoolCode: 'AM-SEC-12345', name: 'Mota Secondary School', level: 'Secondary', ownership: 'Public', city: 'Mota' },
  { schoolCode: 'AM-SEC-13456', name: 'Jima Arada School', level: 'Secondary', ownership: 'Public', city: 'Jima Arada' },
  { schoolCode: 'AM-SEC-14567', name: 'Chagni School', level: 'Secondary', ownership: 'Public', city: 'Chagni' },
  { schoolCode: 'AM-SEC-15678', name: 'Ebinat School', level: 'Secondary', ownership: 'Public', city: 'Ebinat' },
  { schoolCode: 'AM-SEC-16789', name: 'Muger Bridge School', level: 'Secondary', ownership: 'Public', city: 'Muger Bridge' },
  { schoolCode: 'AM-SEC-17890', name: 'Metekel High School', level: 'Secondary', ownership: 'Public', city: 'Metekel' },
  { schoolCode: 'AM-SEC-18901', name: 'Mankush School', level: 'Secondary', ownership: 'Public', city: 'Mankush' },
  { schoolCode: 'AM-SEC-19012', name: 'Bure School', level: 'Secondary', ownership: 'Public', city: 'Bure' },
  { schoolCode: 'AM-SEC-20123', name: 'Amanuel School (Bahir Dar)', level: 'Secondary', ownership: 'Public', city: 'Bahirdar' },
  { schoolCode: 'AM-PREP-21234', name: 'Bahir Dar University Preparatory School', level: 'Preparatory', ownership: 'Public', city: 'Bahirdar' },

  // Oromia Region Schools
  { schoolCode: 'OR-SEC-01234', name: 'Adama Science and Technology School', level: 'Secondary', ownership: 'Public', city: 'Adama' },
  { schoolCode: 'OR-PREP-02345', name: 'Jimma University Preparatory School', level: 'Preparatory', ownership: 'Public', city: 'Jimma' },
  { schoolCode: 'OR-SEC-03456', name: 'Holeta School', level: 'Secondary', ownership: 'Public', city: 'Holeta' },
  { schoolCode: 'OR-SEC-04567', name: 'Weliso School', level: 'Secondary', ownership: 'Public', city: 'Weliso' },
  { schoolCode: 'OR-SEC-05678', name: 'Nekemte Model School', level: 'Secondary', ownership: 'Public', city: 'Nekemte' },
  { schoolCode: 'OR-SEC-06789', name: 'Mettu Secondary School', level: 'Secondary', ownership: 'Public', city: 'Mettu' },
  { schoolCode: 'OR-SEC-07890', name: 'Agaro Secondary School', level: 'Secondary', ownership: 'Public', city: 'Agaro' },
  { schoolCode: 'OR-SEC-08901', name: 'Bedele Model School', level: 'Secondary', ownership: 'Public', city: 'Bedele' },
  { schoolCode: 'OR-SEC-09012', name: 'Gimbi Secondary School', level: 'Secondary', ownership: 'Public', city: 'Gimbi' },
  { schoolCode: 'OR-SEC-10123', name: 'Woliso Secondary School', level: 'Secondary', ownership: 'Public', city: 'Woliso' },
  { schoolCode: 'OR-SEC-11234', name: 'Shambu Secondary School', level: 'Secondary', ownership: 'Public', city: 'Shambu' },
  { schoolCode: 'OR-SEC-12345', name: 'Asella Secondary School', level: 'Secondary', ownership: 'Public', city: 'Asella' },
  { schoolCode: 'OR-SEC-13456', name: 'Adama Secondary School', level: 'Secondary', ownership: 'Public', city: 'Adama' },
  { schoolCode: 'OR-SEC-14567', name: 'Assela School', level: 'Secondary', ownership: 'Public', city: 'Assela' },
  { schoolCode: 'OR-SEC-15678', name: 'Meki School', level: 'Secondary', ownership: 'Public', city: 'Meki' },
  { schoolCode: 'OR-SEC-16789', name: 'Guder School', level: 'Secondary', ownership: 'Public', city: 'Guder' },
  { schoolCode: 'OR-SEC-17890', name: 'Ambo School', level: 'Secondary', ownership: 'Public', city: 'Ambo' },
  { schoolCode: 'OR-SEC-18901', name: 'Sire School', level: 'Secondary', ownership: 'Public', city: 'Sire' },
  { schoolCode: 'OR-SEC-19012', name: 'Sululta School', level: 'Secondary', ownership: 'Public', city: 'Sululta' },
  { schoolCode: 'OR-SEC-20123', name: 'Sendafa School', level: 'Secondary', ownership: 'Public', city: 'Sendafa' },
  { schoolCode: 'OR-SEC-21234', name: 'Finfine School', level: 'Secondary', ownership: 'Public', city: 'Finfine' },
  { schoolCode: 'OR-SEC-22345', name: 'Arsi Negele School', level: 'Secondary', ownership: 'Public', city: 'Arsi Negele' },
  { schoolCode: 'OR-SEC-23456', name: 'Dodola School', level: 'Secondary', ownership: 'Public', city: 'Dodola' },
  { schoolCode: 'OR-SEC-24567', name: 'Robe School', level: 'Secondary', ownership: 'Public', city: 'Robe' },
  { schoolCode: 'OR-SEC-25678', name: 'Goba School', level: 'Secondary', ownership: 'Public', city: 'Goba' },
  { schoolCode: 'OR-SEC-26789', name: 'Bale Robe School', level: 'Secondary', ownership: 'Public', city: 'Bale Robe' },
  { schoolCode: 'OR-SEC-27890', name: 'Harena School', level: 'Secondary', ownership: 'Public', city: 'Harena' },
  { schoolCode: 'OR-SEC-28901', name: 'Alemaya University School', level: 'Secondary', ownership: 'Public', city: 'Alemaya' },

  // SNNP Region Schools
  { schoolCode: 'SN-PREP-01234', name: 'Hawassa University Preparatory School', level: 'Preparatory', ownership: 'Public', city: 'Hawassa' },
  { schoolCode: 'SN-SEC-02345', name: 'Arba Minch Secondary School', level: 'Secondary', ownership: 'Public', city: 'Arba Minch' },
  { schoolCode: 'SN-SEC-03456', name: 'Sodo Secondary School', level: 'Secondary', ownership: 'Public', city: 'Sodo' },
  { schoolCode: 'SN-SEC-04567', name: 'Shashemene Comprehensive School', level: 'Secondary', ownership: 'Public', city: 'Shashemene' },
  { schoolCode: 'SN-SEC-05678', name: 'Bench Maji Secondary School', level: 'Secondary', ownership: 'Public', city: 'Bench Maji' },
  { schoolCode: 'SN-SEC-06789', name: 'Basketo School', level: 'Secondary', ownership: 'Public', city: 'Basketo' },
  { schoolCode: 'SN-SEC-07890', name: 'Kibet School', level: 'Secondary', ownership: 'Public', city: 'Kibet' },
  { schoolCode: 'SN-SEC-08901', name: 'Tepi Secondary School', level: 'Secondary', ownership: 'Public', city: 'Tepi' },
  { schoolCode: 'SN-SEC-09012', name: 'Bonga School', level: 'Secondary', ownership: 'Public', city: 'Bonga' },
  { schoolCode: 'SN-SEC-10123', name: 'Jimma Chora School', level: 'Secondary', ownership: 'Public', city: 'Jimma Chora' },
  { schoolCode: 'SN-PREP-11234', name: 'Wolaita Sodo University School', level: 'Preparatory', ownership: 'Public', city: 'Sodo' },
  { schoolCode: 'SN-SEC-12345', name: 'Hossana School', level: 'Secondary', ownership: 'Public', city: 'Hossana' },
  { schoolCode: 'SN-SEC-13456', name: 'Woliso Secondary School', level: 'Secondary', ownership: 'Public', city: 'Woliso' },
  { schoolCode: 'SN-SEC-14567', name: 'Chiro School', level: 'Secondary', ownership: 'Public', city: 'Chiro' },
  { schoolCode: 'SN-SEC-15678', name: 'Zeway School', level: 'Secondary', ownership: 'Public', city: 'Zeway' },
  { schoolCode: 'SN-SEC-16789', name: 'Mojo School', level: 'Secondary', ownership: 'Public', city: 'Mojo' },
  { schoolCode: 'SN-SEC-17890', name: 'Adami Tulu School', level: 'Secondary', ownership: 'Public', city: 'Adami Tulu' },
  { schoolCode: 'SN-SEC-18901', name: 'Awassa Secondary School', level: 'Secondary', ownership: 'Public', city: 'Awassa' },
  { schoolCode: 'SN-SEC-19012', name: 'Dilla School', level: 'Secondary', ownership: 'Public', city: 'Dilla' },
  { schoolCode: 'SN-SEC-20123', name: 'Konso School', level: 'Secondary', ownership: 'Public', city: 'Konso' },
  { schoolCode: 'SN-SEC-21234', name: 'Yirgalem School', level: 'Secondary', ownership: 'Public', city: 'Yirgalem' },
  { schoolCode: 'SN-SEC-22345', name: 'Hawassa Secondary School', level: 'Secondary', ownership: 'Public', city: 'Hawassa' },

  // Tigray Region Schools
  { schoolCode: 'TI-SEC-01234', name: 'Mekelle Model School', level: 'Secondary', ownership: 'Public', city: 'Mekelle' },
  { schoolCode: 'TI-SEC-02345', name: 'Adigrat Secondary School', level: 'Secondary', ownership: 'Public', city: 'Adigrat' },
  { schoolCode: 'TI-SEC-03456', name: 'Aksum Model School', level: 'Secondary', ownership: 'Public', city: 'Aksum' },
  { schoolCode: 'TI-SEC-04567', name: 'Adwa Secondary School', level: 'Secondary', ownership: 'Public', city: 'Adwa' },
  { schoolCode: 'TI-SEC-05678', name: 'Wukro Secondary School', level: 'Secondary', ownership: 'Public', city: 'Wukro' },
  { schoolCode: 'TI-SEC-06789', name: 'Shire Secondary School', level: 'Secondary', ownership: 'Public', city: 'Shire' },
  { schoolCode: 'TI-SEC-07890', name: 'Maychew School', level: 'Secondary', ownership: 'Public', city: 'Maychew' },
  { schoolCode: 'TI-SEC-08901', name: 'Abi Adi School', level: 'Secondary', ownership: 'Public', city: 'Abi Adi' },
  { schoolCode: 'TI-SEC-09012', name: 'Hintalo School', level: 'Secondary', ownership: 'Public', city: 'Hintalo' },
  { schoolCode: 'TI-SEC-10123', name: 'Samre School', level: 'Secondary', ownership: 'Public', city: 'Samre' },
  { schoolCode: 'TI-SEC-11234', name: 'Waja School', level: 'Secondary', ownership: 'Public', city: 'Waja' },
  { schoolCode: 'TI-SEC-12345', name: 'Humera School', level: 'Secondary', ownership: 'Public', city: 'Humera' },
  { schoolCode: 'TI-SEC-13456', name: 'Shiraro School', level: 'Secondary', ownership: 'Public', city: 'Shiraro' },
  { schoolCode: 'TI-SEC-14567', name: 'Rama School', level: 'Secondary', ownership: 'Public', city: 'Rama' },
  { schoolCode: 'TI-SEC-15678', name: 'Mai Tebri School', level: 'Secondary', ownership: 'Public', city: 'Mai Tebri' },
  { schoolCode: 'TI-PREP-16789', name: 'Mekelle University School', level: 'Preparatory', ownership: 'Public', city: 'Mekelle' },
  { schoolCode: 'TI-PREP-17890', name: 'Axum University School', level: 'Preparatory', ownership: 'Public', city: 'Aksum' },

  // Somali Region Schools
  { schoolCode: 'SO-SEC-01234', name: 'Jijiga Secondary School', level: 'Secondary', ownership: 'Public', city: 'Jijiga' },
  { schoolCode: 'SO-SEC-02345', name: 'Kebri Dehar School', level: 'Secondary', ownership: 'Public', city: 'Kebri Dehar' },
  { schoolCode: 'SO-SEC-03456', name: 'Gode School', level: 'Secondary', ownership: 'Public', city: 'Gode' },
  { schoolCode: 'SO-SEC-04567', name: 'Dega Habur School', level: 'Secondary', ownership: 'Public', city: 'Dega Habur' },
  { schoolCode: 'SO-SEC-05678', name: 'Fik School', level: 'Secondary', ownership: 'Public', city: 'Fik' },
  { schoolCode: 'SO-SEC-06789', name: 'Ginir School', level: 'Secondary', ownership: 'Public', city: 'Ginir' },
  { schoolCode: 'SO-SEC-07890', name: 'Dollo Ado School', level: 'Secondary', ownership: 'Public', city: 'Dollo Ado' },
  { schoolCode: 'SO-SEC-08901', name: 'Jaldesa School', level: 'Secondary', ownership: 'Public', city: 'Jaldesa' },
  { schoolCode: 'SO-SEC-09012', name: 'Hargeisa School', level: 'Secondary', ownership: 'Public', city: 'Hargeisa' },
  { schoolCode: 'SO-SEC-10123', name: 'Bokolmanyo School', level: 'Secondary', ownership: 'Public', city: 'Bokolmanyo' },

  // Afar Region Schools
  { schoolCode: 'AF-SEC-01234', name: 'Afar Secondary School', level: 'Secondary', ownership: 'Public', city: 'Asaita' },
  { schoolCode: 'AF-SEC-02345', name: 'Asaita School', level: 'Secondary', ownership: 'Public', city: 'Asaita' },
  { schoolCode: 'AF-SEC-03456', name: 'Assab Secondary School', level: 'Secondary', ownership: 'Public', city: 'Assab' },
  { schoolCode: 'AF-SEC-04567', name: 'Awash Secondary School', level: 'Secondary', ownership: 'Public', city: 'Awash' },
  { schoolCode: 'AF-SEC-05678', name: 'Dubti School', level: 'Secondary', ownership: 'Public', city: 'Dubti' },
  { schoolCode: 'AF-SEC-06789', name: 'Kilbet Rasu School', level: 'Secondary', ownership: 'Public', city: 'Kilbet Rasu' },
  { schoolCode: 'AF-SEC-07890', name: 'Logia School', level: 'Secondary', ownership: 'Public', city: 'Logia' },
  { schoolCode: 'AF-SEC-08901', name: 'Mille School', level: 'Secondary', ownership: 'Public', city: 'Mille' },
  { schoolCode: 'AF-SEC-09012', name: 'Semera School', level: 'Secondary', ownership: 'Public', city: 'Semera' },
  { schoolCode: 'AF-SEC-10123', name: 'Chifra School', level: 'Secondary', ownership: 'Public', city: 'Chifra' },

  // Gambella Region Schools
  { schoolCode: 'GA-SEC-01234', name: 'Gambella Secondary School', level: 'Secondary', ownership: 'Public', city: 'Gambella' },
  { schoolCode: 'GA-SEC-02345', name: 'Jikawu School', level: 'Secondary', ownership: 'Public', city: 'Jikawu' },
  { schoolCode: 'GA-SEC-03456', name: 'Godere School', level: 'Secondary', ownership: 'Public', city: 'Godere' },
  { schoolCode: 'GA-SEC-04567', name: 'Agano School', level: 'Secondary', ownership: 'Public', city: 'Agano' },
  { schoolCode: 'GA-SEC-05678', name: 'Kurmuk School', level: 'Secondary', ownership: 'Public', city: 'Kurmuk' },
  { schoolCode: 'GA-SEC-06789', name: 'Itang School', level: 'Secondary', ownership: 'Public', city: 'Itang' },
  { schoolCode: 'GA-SEC-07890', name: 'Jipa School', level: 'Secondary', ownership: 'Public', city: 'Jipa' },
  { schoolCode: 'GA-SEC-08901', name: 'Nuer Unity School', level: 'Secondary', ownership: 'Public', city: 'Nuer Unity' },
  { schoolCode: 'GA-SEC-09012', name: 'Dima School', level: 'Secondary', ownership: 'Public', city: 'Dima' },
  { schoolCode: 'GA-SEC-10123', name: 'Anuak School', level: 'Secondary', ownership: 'Public', city: 'Anuak' },

  // Benishangul-Gumuz Region Schools
  { schoolCode: 'BE-SEC-01234', name: 'Bale School', level: 'Secondary', ownership: 'Public', city: 'Bale' },
  { schoolCode: 'BE-SEC-02345', name: 'Assosa Secondary School', level: 'Secondary', ownership: 'Public', city: 'Assosa' },
  { schoolCode: 'BE-SEC-03456', name: 'Metekel Secondary School', level: 'Secondary', ownership: 'Public', city: 'Metekel' },
  { schoolCode: 'BE-SEC-04567', name: 'Kurmuk School', level: 'Secondary', ownership: 'Public', city: 'Kurmuk' },
  { schoolCode: 'BE-SEC-05678', name: 'Guba School', level: 'Secondary', ownership: 'Public', city: 'Guba' },
  { schoolCode: 'BE-SEC-06789', name: 'Sawla School', level: 'Secondary', ownership: 'Public', city: 'Sawla' },
  { schoolCode: 'BE-SEC-07890', name: 'Dabat School', level: 'Secondary', ownership: 'Public', city: 'Dabat' },
  { schoolCode: 'BE-SEC-08901', name: 'Chagni School', level: 'Secondary', ownership: 'Public', city: 'Chagni' },
  { schoolCode: 'BE-SEC-09012', name: 'Pawe School', level: 'Secondary', ownership: 'Public', city: 'Pawe' },
  { schoolCode: 'BE-SEC-10123', name: 'Wegera School', level: 'Secondary', ownership: 'Public', city: 'Wegera' },

  // Harari Region Schools
  { schoolCode: 'HA-SEC-01234', name: 'Harar Secondary School', level: 'Secondary', ownership: 'Public', city: 'Harar' },
  { schoolCode: 'HA-SEC-02345', name: 'Alemaya School', level: 'Secondary', ownership: 'Public', city: 'Harar' },
  { schoolCode: 'HA-SEC-03456', name: 'Medhane Alem School', level: 'Secondary', ownership: 'Public', city: 'Harar' },
  { schoolCode: 'HA-SEC-04567', name: 'Harari Model School', level: 'Secondary', ownership: 'Public', city: 'Harar' },
  { schoolCode: 'HA-SEC-05678', name: 'Jugel School', level: 'Secondary', ownership: 'Public', city: 'Harar' },
  { schoolCode: 'HA-SEC-06789', name: 'Sheikh Hashimi School', level: 'Secondary', ownership: 'Public', city: 'Harar' },
  { schoolCode: 'HA-SEC-07890', name: 'Hassen Ibro School', level: 'Secondary', ownership: 'Public', city: 'Harar' },
  { schoolCode: 'HA-SEC-08901', name: 'Sheikh Bakri School', level: 'Secondary', ownership: 'Public', city: 'Harar' },
  { schoolCode: 'HA-PREP-09012', name: 'Harar University School', level: 'Preparatory', ownership: 'Public', city: 'Harar' },
  { schoolCode: 'HA-SEC-10123', name: 'Harari National School', level: 'Secondary', ownership: 'Public', city: 'Harar' },

  // Dire Dawa Administrative City Schools
  { schoolCode: 'DD-SEC-01234', name: 'Dire Dawa Model School', level: 'Secondary', ownership: 'Public', city: 'Dire Dawa' },
  { schoolCode: 'DD-SEC-02345', name: 'Sheikh Mohammed Ali School', level: 'Secondary', ownership: 'Public', city: 'Dire Dawa' },
  { schoolCode: 'DD-SEC-03456', name: 'Sawdaya School', level: 'Secondary', ownership: 'Public', city: 'Dire Dawa' },
  { schoolCode: 'DD-SEC-04567', name: 'Koree School', level: 'Secondary', ownership: 'Public', city: 'Dire Dawa' },
  { schoolCode: 'DD-SEC-05678', name: 'Sheikh Bashir School', level: 'Secondary', ownership: 'Public', city: 'Dire Dawa' },
  { schoolCode: 'DD-SEC-06789', name: 'Hargeya School', level: 'Secondary', ownership: 'Public', city: 'Dire Dawa' },
  { schoolCode: 'DD-PREP-07890', name: 'Dire Dawa University School', level: 'Preparatory', ownership: 'Public', city: 'Dire Dawa' },
  { schoolCode: 'DD-SEC-08901', name: 'Dakira School', level: 'Secondary', ownership: 'Public', city: 'Dire Dawa' },
  { schoolCode: 'DD-SEC-09012', name: 'Sheikh Umar School', level: 'Secondary', ownership: 'Public', city: 'Dire Dawa' },
  { schoolCode: 'DD-SEC-10123', name: 'Sheikh Abdi School', level: 'Secondary', ownership: 'Public', city: 'Dire Dawa' },

  // Traditional schools
  { schoolCode: 'AA-SEC-00001', name: 'Menelik II School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-00002', name: 'Tafari School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-00003', name: 'General Secondary School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-00004', name: 'Ginbot School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-00005', name: 'St. Joseph School', level: 'Secondary', ownership: 'Private', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-00006', name: 'Saba School', level: 'Secondary', ownership: 'Private', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-00007', name: 'St. George School', level: 'Secondary', ownership: 'Private', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-00008', name: 'Holy Trinity School', level: 'Secondary', ownership: 'Private', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-00009', name: 'Genet School', level: 'Secondary', ownership: 'Private', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-00010', name: 'Leul School', level: 'Secondary', ownership: 'Private', city: 'Addis Ababa' },
  { schoolCode: 'AA-SEC-00011', name: 'Nefas Silk School', level: 'Secondary', ownership: 'Public', city: 'Addis Ababa' },
];

const seedSchools = async () => {
  try {
    await connectDB();

    // Check if schools already exist
    const existingSchools = await School.countDocuments();

    if (existingSchools > 0) {
      console.log('Schools already exist in the database. Skipping seed.');
      process.exit(0);
    }

    // Insert all schools
    await School.insertMany(schools);
    console.log(`${schools.length} schools have been added to the database.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding schools:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedSchools();
}

module.exports = seedSchools;