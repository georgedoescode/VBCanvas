import { createContextHistory } from './createContextHistory';

describe('Context history', () => {
  test('Constructs', () => {
    const history = createContextHistory();

    expect(history).toEqual(
      expect.objectContaining({
        entries: expect.any(Object),
        size: expect.any(Number),
        push: expect.any(Function),
        clear: expect.any(Function),
      })
    );
  });

  test('Drawing command is stored as expected', () => {
    const history = createContextHistory();

    history.push('set', 'strokeStyle', 'black');

    expect(Array.from(history.entries)[0]).toEqual({
      type: 'set',
      name: 'strokeStyle',
      args: 'black',
    });
  });

  test('History size value increments correctly', () => {
    const history = createContextHistory();

    history.push('set', 'strokeStyle', 'black');

    expect(history.size).toBe(1);
  });

  test('History clears as expected', () => {
    const history = createContextHistory();

    history.push('set', 'strokeStyle', 'black');
    history.push('function', 'moveTo', [0, 0]);

    history.clear();

    expect(history.size).toBe(0);
  });
});
