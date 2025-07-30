import { useEffect, useState } from 'react';
import { useFloating } from '@floating-ui/react';
import { Popup } from '@/widget/components/popup';
import { WIDGET_EVENT } from '@/widget/constant';

export const Widget = () => {
  const [text, setText] = useState('');
  const [position, setPosition] = useState<DOMRect | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, update } = useFloating({});

  useEffect(() => {
    const handleWidgetEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        text: string;
        position: DOMRect;
      }>;

      const { text, position } = customEvent.detail;
      setText(text);
      setPosition(position);
      setIsOpen(false);
    };
    window.addEventListener(WIDGET_EVENT, handleWidgetEvent);
    return () => {
      window.removeEventListener(WIDGET_EVENT, handleWidgetEvent);
    };
  }, []);

  useEffect(() => {
    if (position) {
      refs.setReference({
        getBoundingClientRect: () => position,
        contextElement: undefined,
      });
      update();
    }
  }, [position, refs, update]);

  if (!position || !text) return null;

  return (
    <>
      <div ref={refs.setFloating} style={floatingStyles}>
        <button
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          Button
        </button>
      </div>
      {isOpen && <Popup text={text} />}
    </>
  );
};
