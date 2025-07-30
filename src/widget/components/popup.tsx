interface PopupProps {
  text: string;
}

export const Popup = ({ text }: PopupProps) => {
  if (!text) return null;
  return <div className="popup-box">{text}</div>;
};
