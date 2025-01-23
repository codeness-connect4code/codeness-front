import { Trash2 } from 'lucide-react';
import { useHistory } from "react-router-dom";

// onDelete: 삭제할 때 실행 시킬 함수 , id: 삭제할 아이템 ID, url: 리다이렉션 시킬 경로
const TrashButton = ({ onDelete, id, url }) => {

    const history = useHistory();

  const handleClick = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onDelete(id);
      history.push(url);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Trash2 
        size={24} 
        className="text-gray-600 hover:text-red-500 cursor-pointer transition-colors"
        onClick={handleClick}
      />
    </div>
  );
};

export default TrashButton;