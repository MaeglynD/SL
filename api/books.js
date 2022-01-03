const albumIds = JSON.parse(Buffer.from(process.env.ALBUM_IDS, 'base64').toString('utf-8'));

const books = [
  {
    id: 1,
    name: 'Book I',
    desc: 'No description. this book recounts events apirl through october 2021',
    startDate: 1619769600000,
    endDate: 1635667200000,
  },
  {
    id: 2,
    name: 'Book II',
    desc: 'No description. This book recounts events october through april 2021',
    startDate: 1601683200000,
    endDate: 1619049600000,
  },
  {
    id: 3,
    name: 'Book III',
    desc: 'No description. This book recounts events february through august 2020',
    startDate: 1580774400000,
    endDate: 1598745600000,
  },
  {
    id: 4,
    name: 'Book IV',
    desc: 'No description. This book recounts events august through february 2020',
    startDate: 1567209600000,
    endDate: 1580515200000,
  },
  {
    id: 5,
    name: 'Book V',
    desc: 'No description. This book recounts events may through august 2019',
    startDate: 1556668800000,
    endDate: 1567036800000,
  },
  {
    id: 6,
    name: 'Book VI',
    desc: 'No description. This book recounts events december through april 2019',
    startDate: 1543968000000,
    endDate: 1555718400000,
  },
  {
    id: 7,
    name: 'Book VII',
    desc: 'No description. This book recounts events june through november 2018',
    startDate: 1529884800000,
    endDate: 1543363200000,
  },
  {
    id: 8,
    name: 'Book VIII',
    desc: 'No description. This book recounts events january through june 2018',
    startDate: 1515715200000,
    endDate: 1529798400000,
  },
].map((entry) => {
  const { albumId } = albumIds.find(({ id }) => id === entry.id);

  if (!albumId) {
    throw new Error(`No album ID was found for id ${entry.id} (book ${entry.name})`);
  }

  const url = entry.name.split(' ').join('-').toLowerCase();

  return { ...entry, url, albumId };
});

module.exports = books;
