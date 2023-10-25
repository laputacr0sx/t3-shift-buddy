// import React, { FunctionComponent, useState, MutableRefObject } from "react";
// import Keyboard from "react-simple-keyboard";
// import "react-simple-keyboard/build/css/index.css";

// type IProps = {
//   onChange: (input: string) => void;
//   keyboardRef: MutableRefObject<ReturnType<typeof Keyboard>>;
// };

// const KeyboardWrapper = ({ onChange, keyboardRef }: IProps) => {
//   const [layoutName, setLayoutName] = useState("default");

//   const onKeyPress = (button: string) => {
//     if (button === "{shift}" || button === "{lock}") {
//       setLayoutName(layoutName === "default" ? "shift" : "default");
//     }
//   };

//   const thisRef = keyboardRef.current;

//   return (
//     <Keyboard
//       keyboardRef={(r) => (keyboardRef.current = r)}
//       layoutName={layoutName}
//       onChange={onChange}
//       onKeyPress={onKeyPress}
//       onRender={() => console.log("Rendered")}
//     />
//   );
// };

// export default KeyboardWrapper;
