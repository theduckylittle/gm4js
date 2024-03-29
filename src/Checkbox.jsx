import PropTypes from "prop-types";
import {
  IconSquareCheck,
  IconSquare,
  IconCircleCheck,
  IconCircle,
} from "@tabler/icons-react";

import {gmCheckbox, label} from "./common.module.css";

export const Checkbox = ({children, checked, exclusive, ...rest}) => {
  return (
    <button className={gmCheckbox} {...rest}>
      {!exclusive && (checked ? <IconSquareCheck /> : <IconSquare />)}
      {exclusive && (checked ? <IconCircleCheck /> : <IconCircle />)}
      <div className={label}>
        { children }
      </div>
    </button>
  );
}

Checkbox.propTypes = {
  children: PropTypes.node,
  checked: PropTypes.bool,
  exclusive: PropTypes.bool,
};
