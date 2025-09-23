import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { Link as RouterLink } from "react-router-dom";

export const TagItem = ({ tag }) => {
	return (
		<ListItem
			disablePadding
			sx={{
				width: '100%', // ← Важно: элемент занимает всю ширину
				display: 'flex',
				flexWrap: 'wrap', // ← Разрешаем перенос содержимого
			}}
		>
			<ListItemButton
				component={RouterLink}
				to={`/tags/${encodeURIComponent(tag.name)}`}
				sx={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					flexWrap: 'wrap', // ← Ключевое свойство!
					gap: 0.5, // ← Меньше отступов на мобильных
					padding: { xs: '6px 8px', sm: '8px 12px' }, // ← Уменьшаем отступы
					borderRadius: '16px',
					backgroundColor: 'background.paper',
					boxShadow: 1,
					transition: 'all 0.2s ease',
					'&:hover': {
						backgroundColor: 'action.hover',
						boxShadow: 2,
					},
					'&:active': {
						backgroundColor: 'action.selected',
					},
					// На очень маленьких экранах
					'@media (max-width: 375px)': {
						padding: '4px 6px',
						fontSize: '0.8125rem',
					},
				}}
			>
				<ListItemIcon
					sx={{
						minWidth: { xs: 28, sm: 36 },
						margin: 0,
					}}
				>
					<TagIcon sx={{ color: 'primary.main', fontSize: { xs: '1rem', sm: '1.25rem' } }} />
				</ListItemIcon>
				<ListItemText
					primary={tag.name}
					primaryTypographyProps={{
						sx: {
							color: 'primary.main',
							fontWeight: 'bold',
							fontSize: { xs: '0.8125rem', sm: '0.875rem' },
							whiteSpace: 'normal', // ← Разрешаем перенос текста
							wordBreak: 'break-word', // ← Ломаем длинные слова
							flex: '1 1 auto', // ← Занимает оставшееся пространство
							minWidth: 0, // ← Позволяет тексту сжиматься
							overflow: 'hidden', // ← Скрываем переполнение
							textOverflow: 'ellipsis', // ← Точки, если текст слишком длинный
						},
					}}
				/>
			</ListItemButton>
		</ListItem>
	);
};
