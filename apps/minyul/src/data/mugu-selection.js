import { ELEMENTS, SPIRITS } from './mugu-options.js';

export function compatibleElements(spirit) {
  return ELEMENTS.filter(element => !spirit?.incompatibleElements?.includes(element.id));
}

export function compatibleSpirits(elementId) {
  return SPIRITS.filter(spirit => elementId === 'random' || compatibleElements(spirit).some(element => element.id === elementId));
}

// Resolve the god first; fixed elements constrain random god choices too.
export function resolvePair(spiritId, elementId, random = Math.random) {
  const pick = list => list[Math.floor(random() * list.length)];
  const spirit = spiritId === 'random'
    ? pick(compatibleSpirits(elementId))
    : SPIRITS.find(item => item.id === spiritId);
  if (!spirit) return null;
  const elements = compatibleElements(spirit);
  const element = elementId === 'random' ? pick(elements) : elements.find(item => item.id === elementId);
  return element ? {spirit, element} : null;
}
