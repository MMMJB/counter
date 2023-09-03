import React from "react";

export default React.forwardRef((props, ref) => (
  <input
    ref={ref}
    type={props.type}
    placeholder={props.placeholder}
    required
    className="font-roboto text-text-light placeholder:text-text-light/50 border-border rounded-sm border-[1px] px-4 py-2"
  ></input>
));
