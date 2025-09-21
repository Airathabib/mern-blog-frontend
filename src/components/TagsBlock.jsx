import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { Typography, Button } from '@mui/material'
import { Link } from "react-router-dom";
import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items = [], isLoading = false, onShowAll, showAll }) => {
	return (
		<SideBlock title="Тэги">
			<List>
				{(isLoading ? Array(5).fill({ name: '' }) : items).map((tag, i) => (
					<Typography
						key={i}
						component={Link}
						to={`/tags/${encodeURIComponent(tag.name)}`}
						sx={{
							textDecoration: 'none',
							color: 'primary.main',
							'&:hover': {
								color: 'primary.dark',
							},
							transition: 'color 0.3s ease',
						}}
					>
						<ListItem disablePadding>
							<ListItemButton>
								<ListItemIcon>
									<TagIcon sx={{ color: 'primary.main' }} />
								</ListItemIcon>
								{isLoading ? (
									<Skeleton width={100} />
								) : (
									<ListItemText primary={tag.name} />
								)}
							</ListItemButton>
						</ListItem>
					</Typography>
				))}
			</List>

			{!showAll && items.length > 10 && (
				<Button
					fullWidth
					variant="outlined"
					size="small"
					onClick={onShowAll}
					sx={{
						mt: 2,
						borderColor: 'divider',
						color: 'text.secondary',
						'&:hover': {
							backgroundColor: 'action.hover',
							borderColor: 'primary.main',
						},
					}}
				>
					Показать все ({items.length})
				</Button>
			)}
		</SideBlock>
	);
};
