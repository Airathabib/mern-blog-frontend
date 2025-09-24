import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { Link as RouterLink } from "react-router-dom";

export const TagItem = ({ tag }) => {
	return (
		<ListItem
			disablePadding
			sx={{
				width: '100%',
				display: 'flex',
				flexWrap: 'wrap',
			}}
		>
			<ListItemButton
				component={RouterLink}
				to={`/tags/${encodeURIComponent(tag.name)}`}
				sx={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: { xs: 0.5, sm: 1, md: 1.5 },
					padding: {
						xs: '6px 10px',    // ← 320px
						sm: '8px 14px',    // ← 768px
						md: '10px 18px',   // ← 1024px
						lg: '12px 22px',   // ← 1280px+
					},
					borderRadius: {
						xs: '12px',
						sm: '16px',
						md: '20px',
					},
					backgroundColor: 'background.paper',
					boxShadow: 1,
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					'&:hover': {
						backgroundColor: 'action.hover',
						boxShadow: 3,
						transform: 'translateY(-1px)',
					},
					'&:active': {
						backgroundColor: 'action.selected',
						transform: 'translateY(0)',
					},
				}}
			>
				<ListItemIcon
					sx={{
						minWidth: {
							xs: 24,
							sm: 28,
							md: 32,
							lg: 36,
						},
						margin: 0,
					}}
				>
					<TagIcon sx={{
						color: 'primary.main',
						fontSize: {
							xs: '1rem',
							sm: '1.1rem',
							md: '1.25rem',
							lg: '1.4rem',
						},
					}} />
				</ListItemIcon>
				<ListItemText
					primary={tag.name}
					primaryTypographyProps={{
						sx: {
							color: 'primary.main',
							fontWeight: 'bold',
							fontSize: {
								xs: '0.875rem',    // ← 14px на 320px
								sm: '0.95rem',     // ← 15px на 768px
								md: '1.05rem',     // ← 17px на 1024px
								lg: '1.15rem',     // ← 18px на 1280px+
							},
							lineHeight: 1.4,
							whiteSpace: 'normal',
							wordBreak: 'break-all',
							flex: '1 1 auto',
							minWidth: 0,
							overflowWrap: 'break-word',
							textAlign: 'left',
						},
					}}
				/>
			</ListItemButton>
		</ListItem>
	);
};
