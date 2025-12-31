import { MAX_DEADLINE_MINUTES } from "../config/constants";

export function useDeadline() {
  return Math.floor(Date.now() / 1000) + MAX_DEADLINE_MINUTES * 60;
}
