import PropTypes from "prop-types";

import { gmIconButton } from "./common.module.css";

export const IconButton = ({ children, ...props }) => {
  return (
    <button className={gmIconButton} {...props}>
      {children}
    </button>
  );
};

IconButton.propTypes = {
  children: PropTypes.node,
};
