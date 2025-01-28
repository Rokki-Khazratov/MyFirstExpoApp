import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const newsData = [
    {
      id: '1',
      title: 'Critical Developments in Ukraine Conflict',
      description: 'The ongoing conflict in Ukraine continues to dominate global headlines, with recent escalations in the eastern regions. Humanitarian organizations are struggling to provide aid as the situation grows more dire. Thousands of civilians are displaced, and the international community is urging for a peaceful resolution while imposing new sanctions on involved parties. Despite diplomatic efforts, tensions remain high, and experts fear further escalations in the coming weeks.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/2014_pro-Russian_unrest_in_Ukraine%2C_alternate.png/1200px-2014_pro-Russian_unrest_in_Ukraine%2C_alternate.png',
    },
    {
      id: '2',
      title: 'Global Support for Ukraine Grows',
      description: 'As the conflict in Ukraine rages on, nations worldwide are stepping up their support for the embattled country. The latest aid package includes advanced weaponry, humanitarian relief, and financial assistance. International leaders have condemned recent attacks, pledging continued backing for Ukraine’s sovereignty. Volunteers and organizations are also mobilizing across borders, providing shelter and supplies to those affected by the ongoing war.',
      image: 'https://yandex-images.clstorage.net/52hLiR153/5613e6nMBDI/tW_vPkpCcM4MvgQoSz2y3aca_s2lkVzjkbyfF7wsHbzHjMemZopUJ1b65AoA3Db8-_MUbl5EX9JNsPgu9KNGmWB-_C6aBKeb3LmUO0r_89p13azNtFZIYVR6S4Ctrst_RtkdfPuXyf1I4C4DHoHlfDin1H3NlUxI1-Fhefao3cDxKeYzTht2jQitTutAMTfa8FG0C7yVTiNcoM3IZH6LpJ8Bnjk_X0I_iiVgixZC5r375hQwX1LPzJt3KTLy5p6IPeuic8vU-sTMIMhjgDXxWD1UOoJ2HsegFKOFTuK1A-3YiVc4ONZFMUYvbkkcQ-p0_6tdulcTj80ds672vaaejDlorneA0LaDC-4Aron_N1Ly3D1NuppH4VNtQYtlNUJtGYRT-HWZgjvH7a2OGAEuPXKnl_3YmExDEbWlNXlmUk6_7u8wA1LzSgAmwKGOMDXS_F8zQrhQz2fUIcdJ7zJLqpiHGTWwlcgxR6Dhgh4C7vd5p1jwmpOLBVD7Jr73oFkLt6Biuk2ceo0D7cTlTfF5XbXT9Yk7UIpnleGNhuV7hGMbgFcwMVrMNk1haYedByD_MW8deZxdyEZaP-14vaXYD_TiInqMXHoGiePJqsB1PdJ2UPoD9hWA5JUoTk6tegzll0ZRPzGdALbOKKkOlwomdTIvEfCclYTOnDXm-rai2kZx5uewRR07TEFnS2wCeT9YOhn8CTSXAizTLUdA57YM4JMNWb_528E5Rm3iwhXH7vC37VWzFtGIQ1u0YHkwYFgF92Zt-M-dfw1Bp4ClgDk6F_mU8gu8V8DoE-HKCi0yguiSTl57sNcLd8igas7fBi21tyWX_lcWicNYeG05_-7aA3Sv6j_AmXXEi6CIacB1OBd0WjoKftnL4RlhwAClOUSg20cTODqZwHgOrC5JUcFjdfLr2P6XUQhFE_mtt38gW4QwKi8-DNXxDUVpieqNtvbS9dn_AzQfBi3YLgDNow',
    },
    {
      id: '3',
      title: 'Humanitarian Crisis Worsens in Ukraine',
      description: 'With the war showing no signs of abating, Ukraine faces a severe humanitarian crisis. Millions are in urgent need of food, water, and medical supplies, as infrastructure continues to be destroyed by ongoing shelling. Aid agencies are reporting difficulties in reaching the most affected regions due to constant fighting. Efforts are underway to establish humanitarian corridors, but achieving consensus among involved parties remains a significant challenge.',
      image: 'https://yandex-images.clstorage.net/52hLiR153/5613e6nMBDI/tW_vPkpCcM4MvgQoSz2y3aca_s2lkVzjkbyLgr14ifxHWMcmsp4U5Jf5ZcpAC3ZpOnCDeohQ3NFOZHmuYGLEGeA-bnvb0WbPSWzRPV2qpo2gzazK9RNK4JR4jsHs-0hsww2R9yUcFibX42uCnILs97esnPGVlkqEmTAr6HGlX0LlJm14hZy-Swtky-iCObGbdFX8wDvXSmUYYEjJL_0KZBmL2T71XM3_D2AuRlQJLjVy4hT5VpWLR9jwZnq2JtsOc24mfMvf9ofJIIttTbX4X_nTdAA_EcioHe7BA6R0iSwaw1-4PtSEuIepL0HdDiD5eOzW81eZQkOVuexy92baiLfp4jOL3_KDSiyPJkn5v5g3G7kJ9dfCZ5XpDs8g9Mhr1AeaP76VBHmKre8MkskqeLovEfcVXQvOmXOr_XylVISx4iH3SxMwBcxtyKXLvHaT_9u2DjrVQmkW5wHN6nxO7JiBWLW5nMP4ieciyZ6DIPj3Yx3xFp3BxZm8pr93YhLF_2GqeY0YdQ2C4ELrBTWxkDTf8s37mc0gmiHKTuo5Tq1Yy5e_8FMKe46pJ0hRhyfyNusYchNTyY1R-S-5uSFRzzuqbDOImXFOwKCCKsU1Oho60r1Af91C4xkuQIOvM82tkQhf9_HbjPdIryhIlkuncX8rkXgeVUOOEfWmuXFt2Qkxoe44j5s4y8RlSOOEdHDSvlB7gnPfyK9QKEpBLbEF65QBUb0924nzA6eogNCKKPk6YF36053GC9Ox5TM1YVTOsCdtvk0Ze01E7wBpBDAx0n6bsgAz2ods3SZIye1zwStYjBt3uVWB8kCgbMncQGZ39-hRMBJegwsbc6hy8mDUzXwqLXHDm33OjWjHZgA6-Bh5k35Af9iH4RPuSQtjeMgh2IYR_7KTybtJ7S9Dkotpsfus1r7VEENO1TyosrXhUob96qPxDRr6igitxqpMvjHWsJL9DbwWQmCQK0BBpY',
    },
    {
      id: '4',
      title: 'Calls for Peace Intensify Amid Rising Casualties',
      description: 'Global leaders, activists, and citizens are calling for an immediate end to hostilities in Ukraine. Casualties continue to rise, with devastating impacts on civilian populations. Peace talks have been initiated multiple times but have failed to produce lasting agreements. Amid the chaos, grassroots movements are advocating for dialogue and de-escalation, emphasizing the need for diplomacy to prevent further suffering and destruction.',
      image: 'https://s.france24.com/media/display/415c40ae-d912-11ef-ad87-005056a97e36/w:1280/p:16x9/debc58097e381753ce732a4c510965e13688a5b6.jpg',
    },
];

const AllNewsScreen = () => {
  const navigation = useNavigation();

  const shortenDescription = (description) => {
    return description.length > 100 ? `${description.slice(0, 100)}...` : description;
  };
  const handlePress = (news) => {
    navigation.navigate('NewsDetail', { news });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.newsItem}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsDescription}>{shortenDescription(item.description)}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  newsItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default AllNewsScreen;
