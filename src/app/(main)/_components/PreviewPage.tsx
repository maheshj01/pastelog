'use client';
import Editor from '@/app/(main)/_components/Editor';
import { Constants } from '@/app/constants';
import { useNavbar } from '@/lib/Context/PSNavbarProvider';
import { setId } from '@/lib/features/menus/sidebarSlice';
import { AppDispatch, RootState } from '@/lib/store';
import DateUtils from '@/utils/DateUtils';
import { isExpired } from '@/utils/utils';
import { Timestamp } from 'firebase/firestore';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSidebar } from '../_hooks/useSidebar';
import Analytics from '../_services/Analytics';
import LogService from '../_services/logService';
import { DatePicker } from './DatePicker';
import GeminiIcon from './GeminiIcon';
import MDPreview from './MDPreview';
import PreviewAction from './PreviewAction';
import PSAccordion from './PSAccordian';

const PreviewPage = ({ logId }: { logId: string }) => {
	const logService = new LogService();
	const { apiKey } = useSidebar();
	const [loading, setLoading] = useState<boolean>(true);
	const [previewLog, setpreviewLog] = useState<any | null>(null);
	const [editedLog, seteditedLog] = useState<any | null>(null);
	const { theme } = useTheme();
	const pathName = usePathname();
	const isPublishRoute = pathName.includes('/logs/publish');
	const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const showMoreOptions = !Constants.publicLogIds.includes(logId!);
	const { setNavbarTitle } = useNavbar();
	const titleRef = useRef<HTMLParagraphElement>(null);
	const dispatch = useDispatch<AppDispatch>();
	const selected = useSelector((state: RootState) => state.sidebar.selected);
	const onSummarizeClicked = async () => {
		try {
			setSummaryLoading(true);
			const summary = await logService.getSummary(apiKey!, previewLog!);
			previewLog!.summary = summary!;
			logService.saveLogToLocal(previewLog!);
		} catch (error) {
			console.error('Error querying Gemini:', error);
		} finally {
			Analytics.logEvent('gemini_open', { id: logId });
			setSummaryLoading(false);
		}
	};

	const SummaryComponent = React.memo(function SummaryComponent() {
		return (
			<div className="rounded-xl bg-gradient-to-tr">
				{summaryLoading ? (
					<div className="flex items-center justify-center py-4">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
					</div>
				) : previewLog?.summary ? (
					<div className="bg-white bg-opacity-10 rounded-lg px-2">
						<MDPreview
							className="text-black dark:text-white"
							value={previewLog?.summary}
						/>
					</div>
				) : (
					<p className="italic text-black dark:text-white">
						No summary available. Tap the Gemini Icon to generate the Summary
					</p>
				)}
			</div>
		);
	});

	async function fetchLogsByIdFast(id: string) {
		const localLogs = await logService.fetchLogsFromLocal();
		const localLog = localLogs.find((log) => log.id === id);

		if (localLog) {
			return localLog;
		}
		return await logService.fetchLogById(id);
	}

	useEffect(() => {
		if (!logId) return;

		dispatch(setId(logId));

		async function loadLog() {
			setLoading(true);
			if (selected && selected.id === logId) {
				console.log('Using selected from Redux');
				setpreviewLog(selected);
				seteditedLog(selected);
				setLoading(false);
				return;
			}

			const fetchedLog = await fetchLogsByIdFast(logId);

			if (fetchedLog) {
				setpreviewLog(fetchedLog);
				seteditedLog(fetchedLog);
			}

			setLoading(false);
		}

		loadLog();
	}, [logId]);

	useEffect(() => {
		const scrollContainer = document.querySelectorAll('.scrollContainer');
		const scrollRef = scrollContainer[0];
		if (scrollRef) {
			scrollRef.scrollTop = 0;
		}
	}, [logId]);

	useEffect(() => {
		if (!titleRef.current || !previewLog?.title) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				setNavbarTitle(entry.isIntersecting ? null : previewLog?.title || '');
			},
			{
				threshold: 0.1,
				rootMargin: '-8% 0px 0px 0px',
			}
		);

		if (titleRef.current) {
			observer.observe(titleRef.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [previewLog?.title]);

	const handleOnEdit = async (hasUpdated: boolean) => {
		setLoading(true);
		if (hasUpdated) {
			const updatedLog = { ...editedLog! };
			updatedLog.lastUpdatedAt = Timestamp.now();
			await logService.updateLog(logId, updatedLog);
			setpreviewLog({
				...updatedLog,
				lastUpdatedAt: DateUtils.timestampToISOString(updatedLog.lastUpdatedAt),
			});
		} else {
			seteditedLog({ ...previewLog! });
		}
		setIsEditing(false);
		setLoading(false);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	if (!loading && previewLog && isExpired(previewLog.expiryDate)) {
		const className = 'text-md text-black dark:text-slate-50 my-1';
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<p className={'text-3xl'}>{'This Note has Expired'}</p>
					<p className={className}>{'or it has been deleted by the owner'}</p>
				</div>
			</div>
		);
	}

	if (!previewLog) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<p className={'text-3xl'}>{'Note not found'}</p>
					<p className="text-md text-black dark:text-slate-50 my-1">
						{'The requested note could not be found'}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={'flex flex-col items-center h-fit'}>
			<div className="w-full md:w-3/4 lg:w-2/3 max-w-none px-1 prose prose-indigo dark:prose-dark">
				<div className="flex flex-col">
					<div className="flex items-center">
						<div className="grow">
							<div className="flex items-start justify-between w-full gap-4 px-1">
								<p
									ref={titleRef}
									className=" text-black dark:text-slate-50 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium my-1 flex-1 break-words"
								>
									{previewLog?.title}
								</p>
								<div className="flex-shrink-0 self-start">
									<GeminiIcon onGeminiTrigger={onSummarizeClicked}>
										<Image
											src="/images/gemini.png"
											alt="Gemini"
											width={32}
											height={32}
											className={`cursor-pointer transition-transform duration-500 hover:scale-150 h-8 m-0 p-0 ${summaryLoading ? 'animate-pulse scale-150' : ''
												}`}
										/>
									</GeminiIcon>
								</div>
							</div>
							{!loading && (
								<div>
									<PSAccordion title="Details" id="details">
										<div className="text-sm text-gray-500 dark:text-white dark:selection:text-white selection:bg-selection dark:selection:bg-selection">
											<p className="m-0">
												<span className="font-medium">Created At:</span>{' '}
												{DateUtils.formatReadableDate(previewLog?.createdDate!)}
											</p>
											<p className="m-0">
												<span className="font-medium">Last Updated:</span>{' '}
												{isEditing
													? DateUtils.formatReadableDate(
														editedLog?.lastUpdatedAt!
													)
													: DateUtils.formatReadableDate(
														previewLog?.lastUpdatedAt!
													)}
											</p>
											{/* <p className='m-0'>
                                            <span className="font-medium">created by:</span>{" "}
                                            {publishedUser?.displayName || "Anonymous"}
                                        </p> */}
										</div>
									</PSAccordion>
								</div>
							)}
						</div>
					</div>
					{previewLog?.summary && (
						<PSAccordion title="Summary" id="summary" className="flex-grow">
							{!summaryLoading && <SummaryComponent />}
						</PSAccordion>
					)}
					{!loading && (
						<div className="flex flex-row justify-between items-center pt-2">
							{!isEditing
								? previewLog?.expiryDate && (
									<div>
										<p className="text-black dark:text-slate-50 my-1 font-bold">
											{'Expires'}
										</p>
										<p className="text-black dark:text-slate-50 my-1">
											{' '}
											{` ${DateUtils.formatReadableDate(
												previewLog?.expiryDate
											)}`}
										</p>
									</div>
								)
								: previewLog?.expiryDate && (
									<DatePicker
										onDateSelect={(date: string) => {
											seteditedLog((prevLog: any) => ({
												...(prevLog ?? {}),
												expiryDate: date,
											}));
											Analytics.logEvent('set_expiry_date', {
												date: date,
												action: 'click',
											});
										}}
										selected={new Date(editedLog?.expiryDate!)}
									/>
								)}
							<div className="flex w-auto" />
							{showMoreOptions && (
								<PreviewAction
									loading={loading}
									onAction={handleOnEdit}
									setLoading={setLoading}
									previewLog={isEditing ? editedLog! : previewLog!}
									isEditing={isEditing}
									setIsEditing={setIsEditing}
									isPublishRoute={isPublishRoute}
								/>
							)}
						</div>
					)}
					<div className="h-2" />
					<Editor
						preview={isEditing ? false : true}
						className={`bg-background ${theme !== 'dark'
							? ' min-h-screen'
							: 'text-white min-h-screen mt-2'
							}`}
						value={isEditing ? editedLog!.data : previewLog?.data}
						onChange={(e) => {
							if (isEditing) {
								seteditedLog((prevLog: any) => ({
									...(prevLog ?? {}),
									data: e.target.value,
								}));
							}
						}}
						disabled={loading || !isEditing}
					/>
				</div>
			</div>
		</div>
	);
};

export default PreviewPage;
