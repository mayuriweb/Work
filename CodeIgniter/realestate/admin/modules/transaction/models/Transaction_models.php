<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Transaction_models extends CI_Model {

	
	/**
	 * @name string TABLE_NAME Holds the name of the table in use by this model
	 */
	const TABLE_NAME = 'transaction_details';

	/**
	 * @name string PRI_INDEX Holds the name of the tables' primary index used in this model
	 */
	const PRI_INDEX = 'transaction_id';

	public function record_count() {
		$customer = $this->input->get('customer');
		$transaction_type = $this->input->get('transaction_type');
		$transaction_date = $this->input->get('transaction_date');
		
		if ($customer) {
			$this->db->like('first_name', $customer);
			
		}
		if ($transaction_type) {
			$this->db->where('transaction_details.transaction_type', $transaction_type);
			
		}
		if ($transaction_date) {
			$this->db->where('transaction_date', date('Y-m-d',strtotime($transaction_date)));
		}
		$this->db->join('customer', 'customer.c_id = transaction_details.customer_id', 'left');
		$this->db->order_by(self::PRI_INDEX, 'desc');
		$query = $this->db->get(self::TABLE_NAME)->result();

		return count($query);
	}

	public function fetch_data($limit, $start) {
		$customer = $this->input->get('customer');
		$transaction_type = $this->input->get('transaction_type');
		$transaction_date = $this->input->get('transaction_date');
		
		if ($customer) {
			$this->db->like('first_name', $customer);
			
		}
		if ($transaction_type) {
			$this->db->where('transaction_details.transaction_type', $transaction_type);
			
		}
		if ($transaction_date) {
			$this->db->where('transaction_date', date('Y-m-d',strtotime($transaction_date)));
		}
		$this->db->limit($limit, $start);
		$this->db->order_by(self::PRI_INDEX, 'desc');
		$this->db->join('customer', 'customer.c_id = transaction_details.customer_id', 'left');
		
		$query = $this->db->get(self::TABLE_NAME);
		return $query->result();
	}

	public function insert(Array $data) {
		if ($this->db->insert(self::TABLE_NAME, $data)) {
			return $this->db->insert_id();
		} else {
			return false;
		}
	}

	public function update(Array $data, $where = array()) {
		if (!is_array($where)) {
			$where = array(self::PRI_INDEX => $where);
		}
		$this->db->update(self::TABLE_NAME, $data, $where);
		return $this->db->affected_rows();
	}

	public function delete($id) {
		$this->db->where(self::PRI_INDEX, $id);
		$this->db->delete(self::TABLE_NAME);
		return $this->db->affected_rows();
	}
	public function gettransactionByid($id){

        $this->db->where(self::PRI_INDEX, $id);
        $query=  $this->db->get(self::TABLE_NAME)->row();
        return $query;
    }
   

}

/* End of file Area_models.php */
/* amenites: ./application/models/Area_models.php */