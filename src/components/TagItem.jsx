import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { Link as RouterLink } from "react-router-dom";

export const TagItem = ({ tag }) => {
	return (
		<ListItem
			disablePadding
			sx={{
				width: '100%', // ← Важно: элемент занимает всю ширину для корректного переноса
				display: 'flex',
				flexWrap: 'wrap', // ← Разрешаем перенос содержимого
			}}
		>
			<ListItemButton
				component={RouterLink}
				to={`/tags/${encodeURIComponent(tag.name)}`}
				sx={{
					// Сбрасываем фиксированную ширину и разрешаем перенос
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					flexWrap: 'wrap', // ← Ключевое свойство!
					gap: 1, // ← Отступ между иконкой и текстом
					padding: { xs: '8px 12px', sm: '12px 16px' }, // ← Меньше отступов на мобильных
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
						padding: '6px 10px',
						fontSize: '0.875rem',
					},
				}}
			>
				<ListItemIcon
					sx={{
						minWidth: { xs: 32, sm: 40 }, // ← Уменьшаем ширину иконки на мобильных
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
							fontSize: { xs: '0.875rem', sm: '1rem' }, // ← Адаптивный шрифт
							whiteSpace: 'normal', // ← Разрешаем перенос текста
							wordBreak: 'break-word', // ← Ломаем длинные слова
							flex: '1 1 auto', // ← Занимает оставшееся пространство
							minWidth: 0, // ← Позволяет тексту сжиматься
						},
					}}
				/>
			</ListItemButton>
		</ListItem>
	);
};
