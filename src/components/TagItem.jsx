import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { Link } from "react-router-dom";
import { usePrefetchTag } from '../hooks/usePrefetchTag';

export const TagItem = ({ tag, onMouseLeave }) => {
	const { prefetch, cancel } = usePrefetchTag(tag.name);

	const handleMouseEnter = () => {
		prefetch();
	};

	const handleMouseLeave = () => {
		cancel();
		if (onMouseLeave) {
			onMouseLeave();
		}
	};

	return (
		<Link
			to={`/tags/${encodeURIComponent(tag.name)}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{ textDecoration: 'none' }}
		>
			<ListItem disablePadding>
				<ListItemButton>
					<ListItemIcon>
						<TagIcon sx={{ color: 'primary.main' }} />
					</ListItemIcon>
					<ListItemText
						primary={tag.name}
						primaryTypographyProps={{
							sx: {
								color: 'primary.main',
								'&:hover': {
									color: 'primary.dark',
								},
							},
						}}
					/>
				</ListItemButton>
			</ListItem>
		</Link>
	);
};
