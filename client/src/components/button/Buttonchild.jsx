import React from "react";
import PropTypes from "prop-types";
import classNames from "@/utils/classNames";
import { Link } from "react-router-dom";

const Buttonchild = ({
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
    "flex items-center justify-center text-base font-medium rounded-md hover:opacity-90";
  switch (rest.kind) {
    case "primary":
      defaultClassName =
        defaultClassName + " bg-primary text-white hover:bg-[#00F0FF]";
      break;
    case "secondary":
      defaultClassName =
        defaultClassName +
        " bg-white text-black border border-primary hover:bg-primary hover:text-white";
      break;
    case "ghost":
      defaultClassName =
        defaultClassName + " bg-error text-white hover:opacity-50";
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
Buttonchild.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  href: PropTypes.string,
  kind: PropTypes.oneOf(["primary", "secondary", "ghost"]),
};

export default Buttonchild;
