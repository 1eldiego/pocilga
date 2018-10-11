export const getBinaryAction = (buffer) => {
  const type = new Uint8Array(buffer, 0, 1);
  const payload = buffer.slice(1);

  return {
    type: type[0],
    payload,
  };
};

export const createSimpleBinaryAction = (type, payload) => {
  const buffer = new ArrayBuffer(2);
  const binaryType = new Uint8Array(buffer, 0, 1);
  const binaryPayload = new Uint8Array(buffer, 1, 1);

  binaryType[0] = type;
  binaryPayload[0] = payload;

  return buffer;
};

export const parseBinaryPlayers = (buffer) => {
  const view = new DataView(buffer);
  const countPlayers = buffer.byteLength / 7;
  const players = [];

  for (let index = 0; index < countPlayers; index += 1) {
    const offset = index * 7;

    players.push({
      id: view.getUint8(offset),
      x: view.getUint8(offset + 1),
      y: view.getUint8(offset + 2),
      maxhp: view.getUint16(offset + 3),
      hp: view.getUint16(offset + 5),
    });
  }

  return players;
};