import React from 'react';
import { Character } from '../../types';
import MemberCard from '../MemberCard';

interface MemberListProps {
  members: Character[];
  isLoading: boolean;
  onViewCharacter: (char: Character) => void;
  onKickCharacter: (id: string, name: string) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  isLoading,
  onViewCharacter,
  onKickCharacter,
}) => {
  return (
    <div className="grid gap-6 pb-24">
      {members.length === 0 ? (
        <div className="text-center py-20 animate-pulse text-slate-600 italic">
          Waiting for adventurers to join...
        </div>
      ) : (
        members.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            onViewCharacter={onViewCharacter}
            onKickCharacter={onKickCharacter}
          />
        ))
      )}
    </div>
  );
};

export default MemberList;
