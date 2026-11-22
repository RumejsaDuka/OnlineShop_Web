/** Shared, product-only photography. Originals and generation provenance live in design/. */
import { publicAssetPath } from "./site-config";

const photo = (name: string) => publicAssetPath(`/images/studio/${name}.webp`);

export const photography = {
  puffer: photo("puffer"),
  winterPuffer: photo("winter-puffer"),
  shortPuffer: photo("short-puffer"),
  hoodedTracksuit: photo("hooded-tracksuit"),
  pipedTracksuit: photo("piped-tracksuit"),
  stripedTracksuit: photo("striped-tracksuit"),
  grayTracksuit: photo("gray-tracksuit"),
  whiteTee: photo("white-tee"),
  oversizeBlackTee: photo("oversize-black-tee"),
  blackTee: photo("black-tee"),
  classicSneaker: photo("classic-sneaker"),
  retroSneaker: photo("retro-sneaker"),
  cap: photo("cap"),
};

/** Every catalog product uses only its main photograph, including cards and product pages. */
export const productPhotos = (front: string): [string] => [front];
