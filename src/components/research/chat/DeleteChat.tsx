import { Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { GuestChat, deleteGuestChat } from '@/lib/guestStorage';
import { useSession } from '@/lib/hooks/useSession';

const DeleteChat = ({
  chatId,
  chats,
  setChats,
  redirect = false,
}: {
  chatId: string;
  chats: GuestChat[];
  setChats: (chats: GuestChat[]) => void;
  redirect?: boolean;
}) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSession();

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Delete from API for authenticated users
        const res = await fetch(`/api/chats/${chatId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status != 200) {
          throw new Error('Failed to delete chat');
        }
      } else {
        // Delete from local storage for guests
        deleteGuestChat(chatId);
      }

      const newChats = chats.filter((chat) => chat.id !== chatId);
      setChats(newChats);

      if (redirect) {
        window.location.href = '/';
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setConfirmationDialogOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setConfirmationDialogOpen(true);
        }}
        className="bg-transparent text-red-400 hover:scale-105 transition duration-200"
      >
        <Trash size={17} />
      </button>
      <Dialog
        open={confirmationDialogOpen}
        onOpenChange={(open) => {
          if (!loading) {
            setConfirmationDialogOpen(open);
          }
        }}
      >
        <DialogContent className="w-full max-w-md rounded-2xl bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200">
          <DialogTitle className="text-lg font-medium leading-6 dark:text-white">
            Delete Confirmation
          </DialogTitle>
          <DialogDescription className="text-sm dark:text-white/70 text-black/70">
            Are you sure you want to delete this chat?
          </DialogDescription>
          <div className="flex flex-row items-end justify-end space-x-4 mt-6">
            <button
              onClick={() => {
                if (!loading) {
                  setConfirmationDialogOpen(false);
                }
              }}
              className="text-black/50 dark:text-white/50 text-sm hover:text-black/70 hover:dark:text-white/70 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="text-red-400 text-sm hover:text-red-500 transition duration200"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteChat;
