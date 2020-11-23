import React, { useState } from "react";

export default function useForceUpdate() {
  const [state, setState] = useState(new Date());
  const forceUpdate = () => {
    setState(new Date());
  };
  return forceUpdate;
}
