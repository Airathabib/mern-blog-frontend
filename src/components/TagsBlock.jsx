import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";
import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items = [], isLoading = false }) => {
	return (
		<SideBlock title="Тэги">
			<List>
				{(isLoading ? Array(5).fill({ name: '' }) : items).map((tag, i) => (
					<Link
						key={i}
						to={`/tags/${encodeURIComponent(tag.name)}`}
						style={{ textDecoration: "none", color: '#007bff' }}
					>
						<ListItem disablePadding>
							<ListItemButton>
								<ListItemIcon>
									<TagIcon />
								</ListItemIcon>
								{isLoading ? (
									<Skeleton width={100} />
								) : (
									<ListItemText primary={tag.name} />
								)}
							</ListItemButton>
						</ListItem>
					</Link>
				))}
			</List>
		</SideBlock>
	);
};
