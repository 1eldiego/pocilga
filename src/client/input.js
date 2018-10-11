import { createSimpleBinaryAction } from "./binary";
import { sendMessage } from "./networking";
import { MOVE_PLAYER, LEFT, UP, RIGHT, DOWN } from "./constants";

export const keyDown = (event) => {
  let payload;
  let type;

  switch (event.keyCode) {
    case 37:
      type = MOVE_PLAYER;
      payload = LEFT;
      break;
    case 38:
      type = MOVE_PLAYER;
      payload = UP;
      break;
    case 39:
      type = MOVE_PLAYER;
      payload = RIGHT;
      break;
    case 40:
      type = MOVE_PLAYER;
      payload = DOWN;
      break;

    default:
      break;
  }

  if (type) {
    const action = createSimpleBinaryAction(type, payload);
    sendMessage(action);
  }
};