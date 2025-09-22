import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchPosts } from "../redux/slices/posts";

export const usePrefetchTag = (tagName) => {
	const dispatch = useDispatch();
	const controllerRef = useRef(null);
	const timeoutRef = useRef(null);

	const prefetch = () => {
		// Отменяем предыдущий запрос
		if (controllerRef.current) {
			controllerRef.current.abort();
		}

		// Создаём новый AbortController
		controllerRef.current = new AbortController();

		// Дебаунс — ждём 300ms перед загрузкой
		timeoutRef.current = setTimeout(() => {
			dispatch(fetchPosts({
				tag: tagName,
				signal: controllerRef.current.signal, // ← для отмены
			}));
		}, 300);
	};

	const cancel = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (controllerRef.current) {
			controllerRef.current.abort();
		}
	};

	useEffect(() => {
		return () => cancel(); // ← отменяем при размонтировании
	}, []);

	return { prefetch, cancel };
};
