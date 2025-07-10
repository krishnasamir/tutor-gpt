import React from 'react';
import { Message } from '@/utils/types';
import MarkdownWrapper from '../markdownWrapper';
import FileUpload from '../FileUpload';
import { parseFileUploads } from '@/utils/parseFiles';
import { createClient } from '@/utils/supabase/client';
import useSWR from 'swr';

const supabase = createClient();
const fetchUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

interface UserMessageProps {
  message: Message;
}

function getAvatarLetter(name: string) {
  if (!name) return 'Y'; // fallback for "You"
  return name.trim()[0].toUpperCase();
}

function UserMessage({ message }: UserMessageProps) {
  const { content, files } = parseFileUploads(message.content);

  const { data: user, isLoading: isUserLoading } = useSWR('user', fetchUser);

  return (
    <div className="flex w-full justify-end mb-4">
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end gap-1">
          {files.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {files.map((file, index) => (
                <FileUpload key={index} file={file} />
              ))}
            </div>
          )}
          <div className="max-w-xl w-full bg-secondary-background text-foreground rounded-2xl px-4 py-3" style={{
            boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.16)',
            fontFamily: 'Times New Roman, serif'
          }}>
            <MarkdownWrapper text={content} />
          </div>
        </div>
        {/* User avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-base">
            {getAvatarLetter(user?.user_metadata?.full_name || 'You')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserMessage;
