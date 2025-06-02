'use client'
import { Constants } from '@/app/constants';
import { setId, setNavbarTitle, setSelected, setShowSideBar } from '@/lib/features/menus/sidebarSlice';
import { AppDispatch, RootState } from '@/lib/store';
import SearchIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import { Divider, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Analytics from '../../_services/Analytics';
import { Dialog, DialogContent, DialogTrigger } from '../dialog';
import IconButton from '../IconButton';

export function SearchDialog() {
  const logs = useSelector((state: RootState) => state.sidebar.logs);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('');


  function defaultList() {
    return logs;
  }

  const [filteredLogs, setFilteredLogs] = useState<any[]>(defaultList());
  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs])

  const onLogClick = useCallback((log: any | null) => {
    if (log) {
      dispatch(setSelected(log));
      setNavbarTitle('');
      dispatch(setId(log.id!));
      router.push(`/logs/${log.id}`);
      Analytics.logEvent('change_log', { id: log.id, action: 'click' });
      if (window.innerWidth <= 640) {
        dispatch(setShowSideBar(false));
      }
    } else {
      dispatch(setSelected(null));
      dispatch(setId(null));
      router.push('/logs');
      Analytics.logEvent('new_log');
    }
    setOpen(false)
  }, []);


  function documentIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.length > 0) {
      const filteredLogs = logs.filter((log) => log.title.toLowerCase().includes(e.target.value.toLowerCase()));
      setFilteredLogs(filteredLogs);
    } else {
      setFilteredLogs(logs);
    }
  }


  function SearchItem(log: any) {
    return (
      <div className=" flex items-center px-2 hover:bg-surface hover:rounded-lg animate-all duration-100 cursor-pointer h-12" key={log.id}>
        {documentIcon()}
        <div
          onClick={
            () => onLogClick(log)
          }
          key={log.id}>
          <p className="px-1 text-sm">{log.title}</p>
          {/* <p className="px-1 text-sm text-ellipsis">
            {log.data && typeof log.data === 'string'
              ? log.data.substring(0, 100)
              : ""}
          </p> */}
        </div>
      </div>
    )
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton
          onClick={() => { }}
          ariaLabel="Search">
          <SearchIcon className={Constants.styles.iconTheme} />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="md:max-w-[650px] [&>button]:hidden p-0 pb-4">
        <div >
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e)}
            placeholder="Search"
            className="w-full rounded-t-lg"
            classNames={{
              inputWrapper: 'rounded-t-lg rounded-b-none',
            }}
          />
          <div className=" flex items-center px-2 animate-all duration-100 cursor-pointer h-12">
            <PencilSquareIcon className="size-4 text-black dark:text-white" />
            <div
              onClick={
                () => onLogClick(null)
              }>
              <p className="px-1">{'New Note'}</p>
            </div>
          </div>
          <Divider />
          {filteredLogs && filteredLogs.length > 0 ? (
            <div className="max-h-[500px] min-h-[400px] overflow-y-auto px-2">
              {filteredLogs.map((log) => SearchItem(log))}
            </div>
          ) : (
            <div className="max-h-[500px] min-h-[400px] overflow-y-auto px-2 flex items-center justify-center">
              <p className="text-center text-gray-500">Notes not found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog >
  )
}
