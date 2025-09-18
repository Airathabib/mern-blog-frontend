import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeComment } from "../redux/slices/comments";
import { selectUserData } from "../redux/slices/auth";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";

export const CommentsBlock = ({ items, children, isLoading = true }) => {
	const dispatch = useDispatch();
	const userData = useSelector(selectUserData);

	const handleDelete = (commentId) => {
		if (window.confirm('Удалить комментарий?')) {
			dispatch(removeComment(commentId));
		}
	};
	return (
		<SideBlock title="Комментарии">
			<List>
				{(isLoading ? [...Array(5)] : items).map((obj, index) => (
					<React.Fragment key={obj?._id || index}>
						<ListItem alignItems="flex-start">
							<ListItemAvatar>
								{isLoading ? (
									<Skeleton variant="circular" width={40} height={40} />
								) : (
									<Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
								)}
							</ListItemAvatar>
							{isLoading ? (
								<div style={{ display: "flex", flexDirection: "column" }}>
									<Skeleton variant="text" height={25} width={120} />
									<Skeleton variant="text" height={18} width={230} />
								</div>
							) : (
								<>
									<ListItemText
										primary={obj.user.fullName}
										secondary={obj.text}
									/>
									{/* Кнопка удаления — только для автора */}
									{userData?._id === String(obj.user._id) && (
										<IconButton
											edge="end"
											aria-label="delete"
											onClick={() => handleDelete(obj._id)}
											sx={{ ml: 1 }}
										>
											<DeleteIcon color="error" />
										</IconButton>
									)}
								</>
							)}
						</ListItem>
						<Divider variant="inset" component="li" />
					</React.Fragment>
				))}
			</List>
			{children}
			{/* Индикатор загрузки следующей страницы */}
			{isLoading && (
				<div style={{ padding: '8px 16px' }}>
					<Skeleton variant="text" width="80%" height={20} />
					<Skeleton variant="text" width="60%" height={20} style={{ marginTop: 4 }} />
				</div>
			)}
		</SideBlock>
	);
};
