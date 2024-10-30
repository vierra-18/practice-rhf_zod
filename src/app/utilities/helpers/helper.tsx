import React, { ReactElement } from "react";
import { IconType } from "react-icons";

type Icon = IconType | ReactElement;

export const renderIcon = (Icon: Icon) => {
	if (React.isValidElement(Icon)) {
		return Icon;
	}
	if (typeof Icon === "function") {
		return <Icon />;
	}
	return null;
};
