import React from "react";
import List from "@mui/material/List";
import { Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { SideBlock } from "./SideBlock";
import { TagItem } from './TagItem';

export const TagsBlock = ({ items = [], isLoading = false, onShowAll, showAll, onSortChange, currentSort, onShowLess, onResetPosts }) => {
	return (
		<SideBlock title="Тэги">
			{/* Переключатель сортировки */}
			<ToggleButtonGroup
				value={currentSort}
				exclusive
				onChange={onSortChange}
				size="small"
				sx={{
					display: 'flex',
					justifyContent: 'center',
					mb: 2,
					'& .MuiToggleButton-root': {
						border: '1px solid',
						borderColor: 'divider',
						borderRadius: '8px',
						padding: '6px 16px',
						fontWeight: 500,
						fontSize: '0.875rem',
						textTransform: 'none',
						color: 'text.primary',
						backgroundColor: 'background.paper',
						boxShadow: 1,
						transition: 'all 0.3s ease',
						'&:hover': {
							backgroundColor: 'action.hover',
							boxShadow: 2,
						},
						'&.Mui-selected': {
							backgroundColor: 'primary.main',
							color: 'primary.contrastText',
							borderColor: 'primary.main',
							boxShadow: 3,
							'&:hover': {
								backgroundColor: 'primary.dark',
							},
						},
					},
				}}
			>
				<ToggleButton value="new" aria-label="новые">
					Новые
				</ToggleButton>
				<ToggleButton value="popular" aria-label="популярные">
					Популярные
				</ToggleButton>
			</ToggleButtonGroup>

			<List>
				{(isLoading ? Array(5).fill({ name: '' }) : items).map((tag, i) => (
					<TagItem
						key={i}
						tag={tag}
						onMouseLeave={onResetPosts}
					/>
				))}
			</List>

			{!showAll && items.length >= 5 && (
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

			{showAll && (
				<Button
					fullWidth
					variant="outlined"
					size="small"
					onClick={onShowLess}
					sx={{
						mt: 1,
						borderColor: 'divider',
						color: 'text.secondary',
						'&:hover': {
							backgroundColor: 'action.hover',
							borderColor: 'primary.main',
						},
					}}
				>
					Свернуть
				</Button>
			)}
		</SideBlock>
	);
};
