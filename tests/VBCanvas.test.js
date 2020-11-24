import { createCanvas } from '../src/index';
import defaultCanvasOpts from '../src/defaults';

const originalDocHead = document.head.innerHTML;
const originalDocBody = document.body.innerHTML;

describe('VBCanvas', () => {
  afterEach(() => {
    document.body.innerHTML = originalDocBody;
    document.head.innerHTML = originalDocHead;
  });

  describe('VBCanvas -> Initialise', () => {
    it('When no options are passed, then the library initialises as expected', () => {
      expect(createCanvas()).toEqual(
        expect.objectContaining({
          ctx: expect.any(CanvasRenderingContext2D),
          el: expect.any(HTMLCanvasElement),
        })
      );
    });

    it('When options are passed, then the library initialises as expected', () => {
      expect(
        createCanvas({
          ...defaultCanvasOpts,
        })
      ).toEqual(
        expect.objectContaining({
          ctx: expect.any(CanvasRenderingContext2D),
          el: expect.any(HTMLCanvasElement),
        })
      );
    });

    it('When a String target is passed, then the canvas element is mounted correctly', () => {
      const target = document.createElement('div');
      target.id = 'target';

      const otherDiv = document.createElement('div');

      document.body.appendChild(target);
      document.body.appendChild(otherDiv);

      const { el } = createCanvas({
        target: '#target',
      });

      expect(target.contains(el)).toBe(true);
      expect(otherDiv.contains(el)).toBe(false);
    });

    it('When a DOM node target is passed, then the canvas element is mounted correctly', () => {
      const target = document.createElement('div');
      target.id = 'target';

      const otherDiv = document.createElement('div');

      document.body.appendChild(target);
      document.body.appendChild(otherDiv);

      const { el } = createCanvas({
        target: document.getElementById('target'),
      });

      expect(target.contains(el)).toBe(true);
      expect(otherDiv.contains(el)).toBe(false);
    });
  });

  describe('VBCanvas -> Dimensions', () => {
    it('When in autoAspectRatio mode, the canvas element is sized correctly', () => {});
  });
});
