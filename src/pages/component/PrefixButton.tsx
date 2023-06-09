import React from "react";
import { z } from "zod";
import ShiftCard from "./ShiftCard";

interface propType {
  name: string;
}

export default function PrefixButton(props: propType) {
  const { name } = props;

  return <div className="m-5 justify-center">{name}</div>;
}
