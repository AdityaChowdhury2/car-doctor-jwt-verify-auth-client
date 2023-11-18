import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import BookingRow from './BookingRow';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Bookings = () => {
	const { user } = useContext(AuthContext);
	// const [bookings, setBookings] = useState([]);
	const axiosSecure = useAxiosSecure();
	const url = `/bookings?email=${user?.email}`;
	const { data: bookings, refetch } = useQuery({
		queryKey: ['bookings', user?.email],
		enabled: !!user?.email,
		queryFn: async () => {
			const response = await axiosSecure.get(url);
			return response.data;
		},
	});

	const handleDelete = id => {
		const proceed = confirm('Are You sure you want to delete');
		if (proceed) {
			fetch(
				`https://car-doctor-server-adityachowdhury2.vercel.app/bookings/${id}`,
				{
					method: 'DELETE',
				}
			)
				.then(res => res.json())
				.then(data => {
					console.log(data);
					if (data.deletedCount > 0) {
						alert('deleted successful');
						refetch();
					}
				});
		}
	};

	const handleBookingConfirm = id => {
		fetch(
			`https://car-doctor-server-adityachowdhury2.vercel.app/bookings/${id}`,
			{
				method: 'PATCH',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({ status: 'confirm' }),
			}
		)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data.modifiedCount > 0) {
					// update state
					refetch();
					// const remaining = bookings.filter(booking => booking._id !== id);
					// const updated = bookings.find(booking => booking._id === id);
					// updated.status = 'confirm';
					// const newBookings = [updated, ...remaining];
					// setBookings(newBookings);
				}
			});
	};

	return (
		<div>
			<h2 className="text-5xl">Your bookings: {bookings?.length}</h2>
			<div className="overflow-x-auto w-full">
				<table className="table w-full">
					{/* head */}
					<thead>
						<tr>
							<th>
								<label>
									<input type="checkbox" className="checkbox" />
								</label>
							</th>
							<th>Image</th>
							<th>Service</th>
							<th>Date</th>
							<th>Price</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{bookings &&
							bookings?.map(booking => (
								<BookingRow
									key={booking._id}
									booking={booking}
									handleDelete={handleDelete}
									handleBookingConfirm={handleBookingConfirm}
								></BookingRow>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Bookings;
