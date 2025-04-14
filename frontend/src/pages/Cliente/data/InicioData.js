export const cardsData = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    image: 'https://a.rgbimg.com/users/o/or/organza3/300/mtgVC1W.jpg',
    title: `Producto ${i + 1}`,
    line1: 'Descripción',
    line2: 'Precio: $' + (10 + i * 5),
  }));