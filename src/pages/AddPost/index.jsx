import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Box } from '@mui/material'
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { commands } from '@uiw/react-md-editor';
import ImageIcon from '@mui/icons-material/Image';
import axios from '../../axios';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useThemeContext } from '../../contexts/ThemeContext';
import styles from './AddPost.module.scss';

export const AddPost = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const isAuth = useSelector(selectIsAuth)
	const { darkMode } = useThemeContext();
	const [text, setText] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [title, setTitle] = useState('')
	const [tags, setTags] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const inputFieleRef = useRef(null)
	const [previewMode, setPreviewMode] = useState('edit');
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

	const isEditing = Boolean(id)

	// const devAPI = `${process.env.REACT_APP_API_URL}`;



	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0];
			if (!file) return;

			formData.append('image', file);

			const token = window.localStorage.getItem('token');
			const { data } = await axios.post('/upload', formData, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			setImageUrl(data.url);
		} catch (err) {
			console.warn(err);
			showSnackbar('Ошибка при загрузке файла!', 'error');
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl('');
	};

	const onSubmit = async () => {
		try {
			setIsLoading(true);

			const fields = {
				title,
				tags,
				imageUrl,
				text,
			};

			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post('/posts', fields);

			const _id = isEditing ? id : data._id;
			navigate(`/posts/${_id}`);
		} catch (err) {
			console.warn(err);
			showSnackbar('Ошибка при создании статьи!', 'error');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (id) {
			axios.get(`/posts/${id}`)
				.then(({ data }) => {
					setTitle(data.title);
					setText(data.text);
					setImageUrl(data.imageUrl);
					setTags(data.tags.join(', '));
				})
				.catch(err => {
					console.warn(err);
					showSnackbar('Ошибка при получении статьи!', 'error');
				});
		}
	}, [id]);

	const showSnackbar = (message, severity = 'error') => {
		setSnackbar({ open: true, message, severity });
	};

	const handleCloseSnackbar = () => {
		setSnackbar(prev => ({ ...prev, open: false }));
	};

	const handlePaste = async (event) => {
		const items = event.clipboardData.items;
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.type.indexOf('image') === 0) {
				const file = item.getAsFile();
				await uploadImage(file);
				break;
			}
		}
	};

	const handleDrop = async (event) => {
		event.preventDefault();
		const files = event.dataTransfer.files;
		if (files.length > 0) {
			await uploadImage(files[0]);
		}
	};

	const imageUploadCommand = {
		name: 'image-upload',
		keyCommand: 'imageUpload',
		buttonProps: { 'aria-label': 'Вставить изображение' },
		icon: <ImageIcon fontSize="small" />,
		execute: () => {
			inputFieleRef.current?.click();
		},
	};
	const uploadImage = async (file) => {
		try {
			const formData = new FormData();
			formData.append('image', file);

			const token = window.localStorage.getItem('token');
			const { data } = await axios.post('/upload', formData, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});


			const imageUrl = `${process.env.REACT_APP_API_URL}${data.url}`;
			const markdownImage = `![${file.name}](${imageUrl})\n`;
			setText(prev => prev + markdownImage);
		} catch (err) {
			console.warn(err);
			showSnackbar('Ошибка при загрузке изображения!', 'error');
		}
	};

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper sx={{ p: 4 }}>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, mb: 2 }}>
				<Button
					onClick={() => inputFieleRef.current.click()}
					variant="outlined"
					size="large"
				>
					Загрузить превью
				</Button>

				<input
					type="file"
					ref={inputFieleRef}
					onChange={handleChangeFile}
					hidden
				/>
				{imageUrl && (
					<>
						<Button variant="contained" color="error" onClick={onClickRemoveImage} >
							Удалить
						</Button>
						<img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded" />
					</>
				)}
			</Box>

			<TextField
				label="Заголовок статьи"
				variant="outlined"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
				sx={{ mb: 3 }}
			/>
			<TextField
				label="Тэги (через запятую)"
				variant="outlined"
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				fullWidth
				sx={{ mb: 3 }}
			/>
			{/* Переключатель режима */}
			<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
				<Button
					variant={previewMode === 'edit' ? 'contained' : 'outlined'}
					onClick={() => setPreviewMode('edit')}
					size="small"
				>
					Редактировать
				</Button>
				<Button
					variant={previewMode === 'preview' ? 'contained' : 'outlined'}
					onClick={() => setPreviewMode('preview')}
					size="small"
				>
					Превью
				</Button>
			</Box>
			<MDEditor
				value={text}
				onChange={setText}
				height={400}
				preview={previewMode}
				visibleDragbar={false}
				style={{
					borderRadius: 8,
					border: '1px solid',
					borderColor: 'divider',
				}}
				textareaProps={{
					placeholder: 'Введите текст статьи...',
					onPaste: handlePaste,
				}}
				onDrop={handleDrop}
				commands={[
					commands.bold,
					commands.italic,
					commands.strikethrough,
					commands.divider,
					commands.link,
					imageUploadCommand,
					commands.divider,
					commands.quote,
					commands.code,
					commands.divider,
					commands.unorderedListCommand,
					commands.orderedListCommand,
				]}
			/>

			<div className={styles.buttons}>
				<Button
					onClick={onSubmit}
					size="large"
					variant="contained"
					disabled={isLoading}
					sx={{ mr: 2 }}
				>
					{isEditing ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<Button
					component="a"
					href="/"
					size="large"
					variant="outlined"
				>
					Отмена
				</Button>
			</div>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Paper>
	);
};
