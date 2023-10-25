// import React, { FunctionComponent, useState, useRef, ChangeEvent } from "react";
// import KeyboardWrapper from "./KeyboardWrapper";
// import Keyboard from "react-simple-keyboard/build/components/Keyboard";

// const InputKeyboard: FunctionComponent = () => {
//   const [input, setInput] = useState("");
//   const keyboard = useRef<ReturnType<typeof Keyboard> | null>(null);

//   const onChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
//     const input = event.target.value;
//     setInput(input);
//     keyboard.current.setInput(input);
//   };

//   return (
//     <div>
//       <input
//         value={input}
//         placeholder={"Tap on the virtual keyboard to start"}
//         onChange={(e) => onChangeInput(e)}
//       />
//       <KeyboardWrapper keyboardRef={ref} onChange={setInput} />
//     </div>
//   );
// };

// const ref = React.createRef();

// export default InputKeyboard;
