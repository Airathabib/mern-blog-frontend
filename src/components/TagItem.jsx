import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { Link as RouterLink } from "react-router-dom";

export const TagItem = ({ tag }) => {
	return (
		<ListItem disablePadding>
			<ListItemButton
				component={RouterLink}
				to={`/tags/${encodeURIComponent(tag.name)}`}
				sx={{
					'&:active': {
						backgroundColor: 'action.selected',
					},
				}}
			>
				<ListItemIcon>
					<TagIcon sx={{ color: 'primary.main' }} />
				</ListItemIcon>
				<ListItemText
					primary={tag.name}
					primaryTypographyProps={{
						sx: {
							color: 'primary.main',
							fontWeight: 'bold',
						},
					}}
				/>
			</ListItemButton>
		</ListItem>
	);
};
