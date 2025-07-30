import { createRoot } from 'react-dom/client';
import { Widget } from '@/widget/components/widget';
import { WIDGET_EVENT } from '@/widget/constant';
import '@/widget/css/index.css';
import { shadowHostStyle } from '@/widget/index.style';

let previousSelection: string | null = null;

const getPositionCursor = () => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  const rect = range?.getBoundingClientRect();
  return rect;
};

const getSelectedText = (): string | null => {
  const selection = window.getSelection();
  return selection && selection.toString().trim() ? selection.toString() : null;
};

const mouveEventListner = (e: MouseEvent) => {
  const path = e.composedPath();
  const shouldIgnore = path.some((el) => {
    if (!(el instanceof HTMLElement)) return false;
    return el.closest('[data-widget-root]');
  });

  if (shouldIgnore) return;

  const text = getSelectedText();
  const position = getPositionCursor();

  if (text === previousSelection) {
    previousSelection = null;
    return window.dispatchEvent(
      new CustomEvent(WIDGET_EVENT, {
        detail: { text: '', position: null },
      })
    );
  }
  previousSelection = text;
  window.dispatchEvent(
    new CustomEvent(WIDGET_EVENT, {
      detail: { text, position },
    })
  );
};

const renderWidget = () => {
  const shadowHost = document.createElement('div');
  Object.assign(shadowHost.style, shadowHostStyle);
  document.body.appendChild(shadowHost);

  const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
  const mountPoint = document.createElement('div');
  shadowRoot.appendChild(mountPoint);

  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', 'http://localhost:3001/widget.css');
  shadowRoot.appendChild(link);

  mountPoint.setAttribute('data-widget-root', '');
  const root = createRoot(mountPoint);

  document.addEventListener('mouseup', mouveEventListner);
  root.render(<Widget />);
};

(window as unknown as { renderWidget: () => void }).renderWidget = renderWidget;

if (
  document.readyState === 'complete' ||
  document.readyState === 'interactive'
) {
  renderWidget();
} else {
  window.addEventListener('DOMContentLoaded', () => {
    renderWidget();
  });
}
