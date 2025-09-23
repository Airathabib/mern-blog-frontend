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
					// Разрешаем перенос текста
					whiteSpace: 'normal',
					wordBreak: 'break-word', // Ломаем длинные слова
					// Убираем фиксированную ширину, разрешаем растягиваться по контенту
					width: 'auto',
					// Добавляем максимальную ширину, чтобы не вылезать за контейнер
					maxWidth: '100%',
					// Добавляем отступы по бокам на мобильных
					paddingX: { xs: 1, sm: 2 },
					// Вертикальные отступы для лучшего переноса
					marginY: 0.5,
					'&:active': {
						backgroundColor: 'action.selected',
					},
					// На мобильных — уменьшаем шрифт
					'& .MuiListItemText-primary': {
						fontSize: { xs: '0.875rem', sm: '1rem' },
					},
				}}
			>
				<ListItemIcon
					sx={{
						minWidth: { xs: 36, sm: 48 }, // Уменьшаем иконку на мобильных
					}}
				>
					<TagIcon sx={{ color: 'primary.main' }} />
				</ListItemIcon>
				<ListItemText
					primary={tag.name}
					primaryTypographyProps={{
						sx: {
							color: 'primary.main',
							fontWeight: 'bold',
							// Убираем перенос для иконки + текста — теперь переносится весь ListItemButton
							whiteSpace: 'normal',
							wordBreak: 'break-word',
						},
					}}
				/>
			</ListItemButton>
		</ListItem>
	);
};
