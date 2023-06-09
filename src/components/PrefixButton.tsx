import React from "react";

interface propType {
  name: string;
}

export default function PrefixButton(props: propType) {
  const { name } = props;

  return <div className="m-5 justify-center">{name}</div>;
}
