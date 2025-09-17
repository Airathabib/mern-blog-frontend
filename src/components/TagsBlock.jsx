import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items = [], isLoading = false }) => {
	return (
		<SideBlock title="Тэги">
			<List>
				{(isLoading ? [...Array(5)] : items).map((tag, i) => (
					<a
						key={i}  // ← лучше перенести key сюда, а не на ListItem (React требует key на элементе массива)
						style={{ textDecoration: "none", color: "black" }}
						href={`/tags/${isLoading ? '' : tag.name}`}  // ← защита от ошибки при загрузке
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
					</a>
				))}
			</List>
		</SideBlock>
	);
};
