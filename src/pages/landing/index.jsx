import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

function Index() {
    
    return (
        <div className='flex flex-col justify-center items-center h-svh text-4xl font-bold'>
            <p className='animate-pulse'>
                Coming Soon ...
            </p>
            <Link to="/login">
                <Button>
                    Login
                </Button>
            </Link>
        </div>
    )
}

export default Index