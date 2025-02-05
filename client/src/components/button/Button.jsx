import React from "react";
import PropTypes from "prop-types";
import classNames from "@/utils/classNames";
import { Link } from "react-router-dom";

const Button = ({
  type = "button",
  children,
  className = "",
  isLoading = false,
  ...rest
}) => {
  const child = !!isLoading ? (
    <div className="w-10 h-10 border-4 border-white rounded-full border-t-transparent border-b-transparent animate-spin"></div>
  ) : (
    children
  );
  let defaultClassName =
    "flex items-center justify-center text-base font-semibold rounded-xl h-[48px] hover:opacity-80";
  switch (rest.kind) {
    case "primary":
      defaultClassName =
        defaultClassName + " bg-primary text-white border-2 border-primary";
      break;
    case "secondary":
      defaultClassName =
        defaultClassName + " bg-white text-black border-2 border-primary";
      break;
    case "ghost":
      defaultClassName =
        defaultClassName + " bg-white bg-opacity-10 text-text1";
      break;

    default:
      break;
  }
  if (rest.href)
    return (
      <Link to={rest.href} className={classNames(defaultClassName, className)}>
        {child}
      </Link>
    );
  return (
    <button
      className={classNames(
        defaultClassName,
        !!isLoading ? "opacity-50 pointer-events-none" : "",
        className
      )}
      type={type}
      {...rest}
    >
      {child}
    </button>
  );
};
Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  href: PropTypes.string,
  kind: PropTypes.oneOf(["primary", "secondary", "ghost"]),
};

export default Button;
