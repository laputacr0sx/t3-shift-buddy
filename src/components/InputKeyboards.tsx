// import { useState, useRef, ChangeEvent, ComponentProps } from "react";
// import KeyboardWrapper from "./KeyboardWrapper";
// import KeyboardReact from "react-simple-keyboard/build/components/Keyboard";

// const InputKeyboard = () => {
//   const [input, setInput] = useState("");
//   const keyboard = useRef<ComponentProps<typeof KeyboardReact> | null>(null);

//   const onChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
//     const input = event.target.value;
//     keyboard.current?.setInput(input);
//   };

//   return (
//     <div>
//       <input
//         value={input}
//         placeholder={"Tap on the virtual keyboard to start"}
//         onChange={(e) => onChangeInput(e)}
//       />
//       <KeyboardWrapper keyboardRef={keyboard} onChange={setInput} />
//     </div>
//   );
// };

// export default InputKeyboard;
