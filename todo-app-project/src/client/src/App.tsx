import { useEffect, useState } from 'react';

export default function App() {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    setImageSrc('/assets/image.jpg');
  }, []);

  return (
    <>
      <img src={imageSrc} width="400" height="400" />
      <form>
        <input type="text" maxLength={140} />
        <button type="submit">Create Todo</button>
      </form>
      <ul>
        <li>Todo 1</li>
        <li>Todo 2</li>
      </ul>
    </>
  );
}
