<?php
class ControllerExtensionModuleThemeMostViewed extends Controller {
	public function index($setting) {
		
		static $module = 0;
		
		$this->load->language('extension/module/theme_most_viewed');

		$data['heading_title'] = $this->language->get('heading_title');

		$data['text_tax'] = $this->language->get('text_tax');

		$data['button_cart'] = $this->language->get('button_cart');
		$data['button_wishlist'] = $this->language->get('button_wishlist');
		$data['button_compare'] = $this->language->get('button_compare');
		
		$data['lang_id'] = $this->config->get('config_language_id');
		$lang_id = $this->config->get('config_language_id');
		
		$data['t1o_text_sale'] = $this->config->get('t1o_text_sale');
		$data['t1o_text_new_prod'] = $this->config->get('t1o_text_new_prod');
		$data['t1o_text_quickview'] = $this->config->get('t1o_text_quickview');
		$data['t1o_text_most_viewed'] = $this->config->get('t1o_text_most_viewed');
		
		$data['t1o_most_viewed_style'] = $this->config->get('t1o_most_viewed_style');
		$data['t1o_most_viewed_per_row'] = $this->config->get('t1o_most_viewed_per_row');
		$data['t1o_out_of_stock_badge_status'] = $this->config->get('t1o_out_of_stock_badge_status');
		$data['t1o_sale_badge_status'] = $this->config->get('t1o_sale_badge_status');
		$data['t1o_sale_badge_type'] = $this->config->get('t1o_sale_badge_type');
		$data['t1o_new_badge_status'] = $this->config->get('t1o_new_badge_status');
		$data['t1d_img_style'] = $this->config->get('t1d_img_style');
		$data['t1o_category_prod_box_style'] = $this->config->get('t1o_category_prod_box_style');
		
		$data['lazy_load_placeholder'] = 'catalog/view/theme/' . $this->config->get('config_theme') . '/js/lazyload/loading.gif';

		$this->load->model('catalog/product');

		$this->load->model('tool/image');

		$data['products'] = array();
		
		$query = $this->db->query("SELECT p.product_id FROM " . DB_PREFIX . "product p LEFT JOIN " . DB_PREFIX . "product_to_store p2s ON (p.product_id = p2s.product_id) WHERE p.status = '1' AND p.date_available <= NOW() AND p2s.store_id = '" . (int)$this->config->get('config_store_id') . "' ORDER BY p.viewed DESC LIMIT " . (int)$setting['limit']);
		
		foreach ($query->rows as $result) { 		
			$product_data[$result['product_id']] = $this->model_catalog_product->getProduct($result['product_id']);
		}

		$results = $product_data;

		if ($results) {
			foreach ($results as $result) {
				if ($result['image']) {
					$image = $this->model_tool_image->resize($result['image'], $setting['width'], $setting['height']);
				} else {
					$image = $this->model_tool_image->resize('placeholder.png', $setting['width'], $setting['height']);
				}
				
				$swapimages = $this->model_catalog_product->getProductImages($result['product_id']);
			    if ($swapimages) {
				    $swapimage = $this->model_tool_image->resize($swapimages[0]['image'], $setting['width'], $setting['height']);
			    } else {
				    $swapimage = false;
			    }

				if ($this->customer->isLogged() || !$this->config->get('config_customer_price')) {
					$price = $this->currency->format($this->tax->calculate($result['price'], $result['tax_class_id'], $this->config->get('config_tax')), $this->session->data['currency']);
				} else {
					$price = false;
				}

				if ((float)$result['special']) {
					$special = $this->currency->format($this->tax->calculate($result['special'], $result['tax_class_id'], $this->config->get('config_tax')), $this->session->data['currency']);
				} else {
					$special = false;
				}

				if ($this->config->get('config_tax')) {
					$tax = $this->currency->format((float)$result['special'] ? $result['special'] : $result['price'], $this->session->data['currency']);
				} else {
					$tax = false;
				}

				if ($this->config->get('config_review_status')) {
					$rating = $result['rating'];
				} else {
					$rating = false;
				}
				
				$out_of_stock_badge = $result['quantity'] <= 0 ? $result['stock_status'] : 1;

				$data['most_viewed'][] = array(
					'product_id'  => $result['product_id'],
					'thumb'       => $image,
					'thumb_swap'  => $swapimage,
					'newstart'   => $result['date_added'],
				    'quickview'  => $this->url->link('product/quickview', 'product_id=' . $result['product_id']),
					'name'        => $result['name'],
					'description' => utf8_substr(trim(strip_tags(html_entity_decode($result['description'], ENT_QUOTES, 'UTF-8'))), 0, $this->config->get('theme_' . $this->config->get('config_theme') . '_product_description_length')) . '..',
					'price'       => $price,
					'special'     => $special,
					'tax'         => $tax,
					'rating'      => $rating,
					'href'        => $this->url->link('product/product', 'product_id=' . $result['product_id']),
					'out_of_stock_quantity'  => $result['quantity'],
                    'out_of_stock_badge'  => $out_of_stock_badge,
					'brand'      => $result['manufacturer'],
				    'brand_url'  => $this->url->link('product/manufacturer/info', 'manufacturer_id=' . $result['manufacturer_id']),
					'val1'        => preg_replace("/[^0-9.]/", "", $result['special']),
					'val2'        => preg_replace("/[^0-9.]/", "", $result['price']),
					'startDate1'  => strtotime(mb_substr($result['date_added'], 0, 10)),
					'endDate2'    => strtotime(date("Y-m-d")),
				);
			}
		}

			$data['module'] = $module++;
			
			return $this->load->view('extension/module/theme_most_viewed', $data);
		}
	}
