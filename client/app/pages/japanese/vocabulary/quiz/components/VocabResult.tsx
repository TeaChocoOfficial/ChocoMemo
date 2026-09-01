// -Path: 'client/app/pages/japanese/vocabulary/quiz/components/VocabResult.tsx'
import QuizResult from '../../../quiz/components/QuizResult';

interface VocabResultProps {
    score: number;
    total: number;
    title: string;
    retryLabel: string;
    onRetry: () => void;
}

export default function VocabResult(props: VocabResultProps) {
    return <QuizResult {...props} />;
}
